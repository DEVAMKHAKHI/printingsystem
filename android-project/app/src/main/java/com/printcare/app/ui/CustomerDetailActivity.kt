package com.printcare.app.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.printcare.app.databinding.ActivityCustomerDetailBinding

/**
 * Displays complete details of a selected customer record with quick Call and Email actions.
 */
class CustomerDetailActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_CUSTOMER_ID = "extra_customer_id"
        const val EXTRA_NAME = "extra_name"
        const val EXTRA_PHONE = "extra_phone"
        const val EXTRA_DOB = "extra_dob"
        const val EXTRA_EMAIL = "extra_email"
        const val EXTRA_ADDRESS = "extra_address"
        const val EXTRA_CREATED_AT = "extra_created_at"
    }

    private lateinit var binding: ActivityCustomerDetailBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCustomerDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.toolbarDetail.setNavigationOnClickListener {
            finish()
        }

        val customerId = intent.getStringExtra(EXTRA_CUSTOMER_ID).orEmpty()
        val name = intent.getStringExtra(EXTRA_NAME).orEmpty()
        val phone = intent.getStringExtra(EXTRA_PHONE).orEmpty()
        val dob = intent.getStringExtra(EXTRA_DOB).orEmpty()
        val email = intent.getStringExtra(EXTRA_EMAIL).orEmpty()
        val address = intent.getStringExtra(EXTRA_ADDRESS).orEmpty()
        val createdAt = intent.getStringExtra(EXTRA_CREATED_AT).orEmpty()

        binding.tvDetailInitials.text = extractInitials(name)
        binding.tvDetailName.text = name
        binding.tvDetailCustomerId.text = "ID: $customerId"
        binding.tvDetailPhone.text = phone
        binding.tvDetailEmail.text = email
        binding.tvDetailDob.text = dob
        binding.tvDetailAddress.text = address
        binding.tvDetailCreatedAt.text = createdAt

        binding.btnCallCustomer.setOnClickListener {
            val dialIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone"))
            startActivity(dialIntent)
        }

        binding.btnEmailCustomer.setOnClickListener {
            val emailIntent = Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:$email")).apply {
                putExtra(Intent.EXTRA_SUBJECT, "PrintCare Service Update")
            }
            startActivity(emailIntent)
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
