package com.printcare.app.ui

import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.Menu
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.printcare.app.R
import com.printcare.app.adapter.CustomerAdapter
import com.printcare.app.databinding.ActivityCustomerListBinding
import com.printcare.app.model.Customer
import com.printcare.app.repository.FirebaseRepository
import java.text.SimpleDateFormat
import java.util.Locale

/**
 * Customer List Screen displaying all Firestore customer records in a RecyclerView
 * with real-time search by name or phone number, pull-to-refresh, loading, empty, and error states.
 */
class CustomerListActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCustomerListBinding
    private lateinit var adapter: CustomerAdapter
    private val repository = FirebaseRepository()
    private var allCustomers: List<Customer> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCustomerListBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupToolbar()
        setupRecyclerView()
        setupSearchFilter()
        setupRefreshAndEmptyActions()
        loadCustomers()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbarCustomerList)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        binding.toolbarCustomerList.setNavigationOnClickListener {
            finish()
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_customer_list, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_refresh -> {
                loadCustomers()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun setupRecyclerView() {
        adapter = CustomerAdapter { customer ->
            openCustomerDetails(customer)
        }
        binding.rvCustomers.layoutManager = LinearLayoutManager(this)
        binding.rvCustomers.adapter = adapter
    }

    private fun setupSearchFilter() {
        binding.etSearchCustomers.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) = Unit
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                applySearchFilter(s?.toString().orEmpty())
            }
            override fun afterTextChanged(s: Editable?) = Unit
        })
    }

    private fun setupRefreshAndEmptyActions() {
        binding.swipeRefreshCustomers.setColorSchemeResources(R.color.printcare_blue_primary)
        binding.swipeRefreshCustomers.setOnRefreshListener {
            loadCustomers(fromSwipe = true)
        }

        binding.btnRetryLoad.setOnClickListener {
            loadCustomers()
        }

        binding.btnRegisterFirstCustomer.setOnClickListener {
            startActivity(Intent(this, CustomerRegistrationActivity::class.java))
        }
    }

    private fun loadCustomers(fromSwipe: Boolean = false) {
        if (!fromSwipe) {
            showLoadingState()
        }

        repository.fetchAllCustomers(
            onSuccess = { customers ->
                binding.swipeRefreshCustomers.isRefreshing = false
                allCustomers = customers
                applySearchFilter(binding.etSearchCustomers.text?.toString().orEmpty())
            },
            onError = { errorMessage ->
                binding.swipeRefreshCustomers.isRefreshing = false
                showErrorState(errorMessage)
            }
        )
    }

    private fun applySearchFilter(query: String) {
        val trimmed = query.trim().lowercase(Locale.getDefault())
        val filtered = if (trimmed.isEmpty()) {
            allCustomers
        } else {
            allCustomers.filter { customer ->
                customer.name.lowercase(Locale.getDefault()).contains(trimmed) ||
                    customer.phone.contains(trimmed)
            }
        }

        adapter.submitList(filtered)
        binding.tvCustomerCountBadge.text =
            resources.getQuantityString(R.plurals.customer_count_format, filtered.size, filtered.size)

        if (filtered.isEmpty()) {
            showEmptyState(isSearchActive = trimmed.isNotEmpty())
        } else {
            showContentState()
        }
    }

    private fun showLoadingState() {
        binding.progressCustomers.visibility = View.VISIBLE
        binding.rvCustomers.visibility = View.GONE
        binding.layoutEmptyState.visibility = View.GONE
        binding.layoutErrorState.visibility = View.GONE
    }

    private fun showContentState() {
        binding.progressCustomers.visibility = View.GONE
        binding.rvCustomers.visibility = View.VISIBLE
        binding.layoutEmptyState.visibility = View.GONE
        binding.layoutErrorState.visibility = View.GONE
    }

    private fun showEmptyState(isSearchActive: Boolean) {
        binding.progressCustomers.visibility = View.GONE
        binding.rvCustomers.visibility = View.GONE
        binding.layoutErrorState.visibility = View.GONE
        binding.layoutEmptyState.visibility = View.VISIBLE

        if (isSearchActive) {
            binding.tvEmptyTitle.text = getString(R.string.empty_search_title)
            binding.tvEmptySubtitle.text = getString(R.string.empty_search_subtitle)
            binding.btnRegisterFirstCustomer.visibility = View.GONE
        } else {
            binding.tvEmptyTitle.text = getString(R.string.empty_customers_title)
            binding.tvEmptySubtitle.text = getString(R.string.empty_customers_subtitle)
            binding.btnRegisterFirstCustomer.visibility = View.VISIBLE
        }
    }

    private fun showErrorState(message: String) {
        binding.progressCustomers.visibility = View.GONE
        binding.rvCustomers.visibility = View.GONE
        binding.layoutEmptyState.visibility = View.GONE
        binding.layoutErrorState.visibility = View.VISIBLE
        binding.tvErrorMessage.text = message
    }

    private fun openCustomerDetails(customer: Customer) {
        val formattedCreatedAt = customer.createdAt?.toDate()?.let { date ->
            SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault()).format(date)
        } ?: getString(R.string.label_not_available)

        val intent = Intent(this, CustomerDetailActivity::class.java).apply {
            putExtra(CustomerDetailActivity.EXTRA_CUSTOMER_ID, customer.customerId)
            putExtra(CustomerDetailActivity.EXTRA_NAME, customer.name)
            putExtra(CustomerDetailActivity.EXTRA_PHONE, customer.phone)
            putExtra(CustomerDetailActivity.EXTRA_DOB, customer.dob)
            putExtra(CustomerDetailActivity.EXTRA_EMAIL, customer.email)
            putExtra(CustomerDetailActivity.EXTRA_ADDRESS, customer.address)
            putExtra(CustomerDetailActivity.EXTRA_CREATED_AT, formattedCreatedAt)
        }
        startActivity(intent)
    }
}
