package com.printcare.app.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.printcare.app.databinding.ItemCustomerBinding
import com.printcare.app.model.Customer

/**
 * RecyclerView Adapter displaying registered customer cards and supporting click & search filtering.
 */
class CustomerAdapter(
    private val onCustomerClick: (Customer) -> Unit
) : RecyclerView.Adapter<CustomerAdapter.CustomerViewHolder>() {

    private val items = mutableListOf<Customer>()

    fun submitList(newCustomers: List<Customer>) {
        items.clear()
        items.addAll(newCustomers)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomerViewHolder {
        val binding = ItemCustomerBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return CustomerViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CustomerViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    inner class CustomerViewHolder(
        private val binding: ItemCustomerBinding
    ) : RecyclerView.ViewHolder(binding.root) {

        fun bind(customer: Customer) {
            binding.tvCustomerName.text = customer.name
            binding.tvCustomerInitials.text = extractInitials(customer.name)
            binding.tvCustomerPhone.text = customer.phone
            binding.tvCustomerEmail.text = customer.email
            binding.tvCustomerDob.text = customer.dob
            binding.tvCustomerAddress.text = customer.address

            binding.root.setOnClickListener {
                onCustomerClick(customer)
            }
        }

        private fun extractInitials(name: String): String {
            val parts = name.trim().split(Regex("\\s+")).filter { it.isNotEmpty() }
            return when {
                parts.isEmpty() -> "PC"
                parts.size == 1 -> parts[0].take(2).uppercase()
                else -> "${parts.first().first()}${parts.last().first()}".uppercase()
            }
        }
    }
}
