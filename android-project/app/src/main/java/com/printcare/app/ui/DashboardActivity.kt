package com.printcare.app.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.printcare.app.R
import com.printcare.app.databinding.ActivityDashboardBinding
import com.printcare.app.repository.FirebaseRepository

/**
 * Customer Management Dashboard providing quick navigation to register customers,
 * view the customer directory, and securely sign out.
 */
class DashboardActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDashboardBinding
    private val repository = FirebaseRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDashboardBinding.inflate(layoutInflater)
        setContentView(binding.root)

        if (!repository.isUserLoggedIn()) {
            navigateToLogin()
            return
        }

        bindUserHeader()
        setupActions()
    }

    override fun onResume() {
        super.onResume()
        loadCustomerSummaryCount()
    }

    private fun bindUserHeader() {
        val user = repository.getCurrentUser()
        val displayName = user?.displayName?.takeIf { it.isNotBlank() }
            ?: user?.email?.substringBefore("@")
            ?: "Shop Staff"

        binding.tvWelcomeMessage.text = getString(R.string.welcome_user_format, displayName)
        binding.tvUserEmail.text = user?.email.orEmpty()
    }

    private fun loadCustomerSummaryCount() {
        repository.fetchCustomerCount(
            onSuccess = { count ->
                binding.tvTotalCustomersCount.text = count.toString()
            },
            onError = {
                binding.tvTotalCustomersCount.text = "--"
            }
        )
    }

    private fun setupActions() {
        binding.cardRegisterCustomer.setOnClickListener {
            startActivity(Intent(this, CustomerRegistrationActivity::class.java))
        }

        binding.btnRegisterCustomer.setOnClickListener {
            startActivity(Intent(this, CustomerRegistrationActivity::class.java))
        }

        binding.cardViewCustomers.setOnClickListener {
            startActivity(Intent(this, CustomerListActivity::class.java))
        }

        binding.btnViewCustomers.setOnClickListener {
            startActivity(Intent(this, CustomerListActivity::class.java))
        }

        binding.btnLogout.setOnClickListener {
            confirmLogout()
        }
    }

    private fun confirmLogout() {
        MaterialAlertDialogBuilder(this)
            .setTitle(R.string.logout_dialog_title)
            .setMessage(R.string.logout_dialog_message)
            .setNegativeButton(R.string.action_cancel, null)
            .setPositiveButton(R.string.action_logout) { _, _ ->
                repository.signOut()
                navigateToLogin()
            }
            .show()
    }

    private fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        startActivity(intent)
        finish()
    }
}
