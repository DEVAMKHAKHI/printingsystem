package com.printcare.app.ui

import android.app.DatePickerDialog
import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import com.printcare.app.R
import com.printcare.app.databinding.ActivityCustomerRegistrationBinding
import com.printcare.app.repository.FirebaseRepository
import com.printcare.app.utils.ValidationUtils
import java.util.Calendar
import java.util.Locale

/**
 * Customer Registration Form capturing Full Name, 10-digit Indian Phone Number,
 * Date of Birth via DatePickerDialog, Email, and Multiline Address, then saving to Cloud Firestore.
 */
class CustomerRegistrationActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCustomerRegistrationBinding
    private val repository = FirebaseRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCustomerRegistrationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupToolbar()
        setupDatePicker()
        setupButtons()
    }

    private fun setupToolbar() {
        binding.toolbarRegister.setNavigationOnClickListener {
            finish()
        }
    }

    private fun setupDatePicker() {
        val openPicker = View.OnClickListener {
            showDobPickerDialog()
        }
        binding.etDob.setOnClickListener(openPicker)
        binding.tilDob.setEndIconOnClickListener(openPicker)
    }

    private fun showDobPickerDialog() {
        val calendar = Calendar.getInstance()
        val existingDob = binding.etDob.text?.toString().orEmpty()
        if (existingDob.matches(Regex("^[0-9]{2}/[0-9]{2}/[0-9]{4}$"))) {
            val parts = existingDob.split("/")
            calendar.set(parts[2].toInt(), parts[1].toInt() - 1, parts[0].toInt())
        } else {
            calendar.add(Calendar.YEAR, -25)
        }

        val dialog = DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                val formatted = String.format(
                    Locale.getDefault(),
                    "%02d/%02d/%04d",
                    dayOfMonth,
                    month + 1,
                    year
                )
                binding.etDob.setText(formatted)
                binding.tilDob.error = null
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )
        dialog.datePicker.maxDate = System.currentTimeMillis()
        dialog.show()
    }

    private fun setupButtons() {
        binding.btnSaveCustomer.setOnClickListener {
            validateAndSaveCustomer()
        }

        binding.btnClearForm.setOnClickListener {
            clearFormFields()
        }
    }

    private fun validateAndSaveCustomer() {
        val name = binding.etCustomerName.text?.toString().orEmpty()
        val phone = binding.etPhone.text?.toString().orEmpty()
        val dob = binding.etDob.text?.toString().orEmpty()
        val email = binding.etCustomerEmail.text?.toString().orEmpty()
        val address = binding.etAddress.text?.toString().orEmpty()

        val nameError = ValidationUtils.validateCustomerName(name)
        val phoneError = ValidationUtils.validateIndianPhone(phone)
        val dobError = ValidationUtils.validateDob(dob)
        val emailError = ValidationUtils.validateEmail(email)
        val addressError = ValidationUtils.validateAddress(address)

        binding.tilCustomerName.error = nameError
        binding.tilPhone.error = phoneError
        binding.tilDob.error = dobError
        binding.tilCustomerEmail.error = emailError
        binding.tilAddress.error = addressError

        if (nameError != null || phoneError != null || dobError != null ||
            emailError != null || addressError != null
        ) {
            return
        }

        setLoading(true)
        repository.saveCustomer(
            name = name,
            phone = phone,
            dob = dob,
            email = email,
            address = address,
            onSuccess = { customerId ->
                setLoading(false)
                showSuccessDialog(customerId, name.trim())
            },
            onError = { message ->
                setLoading(false)
                Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG).show()
            }
        )
    }

    private fun showSuccessDialog(customerId: String, customerName: String) {
        MaterialAlertDialogBuilder(this)
            .setTitle(R.string.customer_saved_title)
            .setMessage(getString(R.string.customer_saved_message, customerName, customerId))
            .setCancelable(false)
            .setNegativeButton(R.string.action_add_another) { _, _ ->
                clearFormFields()
            }
            .setPositiveButton(R.string.action_view_customers) { _, _ ->
                startActivity(Intent(this, CustomerListActivity::class.java))
                finish()
            }
            .show()
    }

    private fun clearFormFields() {
        binding.etCustomerName.setText("")
        binding.etPhone.setText("")
        binding.etDob.setText("")
        binding.etCustomerEmail.setText("")
        binding.etAddress.setText("")

        binding.tilCustomerName.error = null
        binding.tilPhone.error = null
        binding.tilDob.error = null
        binding.tilCustomerEmail.error = null
        binding.tilAddress.error = null

        binding.etCustomerName.requestFocus()
    }

    private fun setLoading(isLoading: Boolean) {
        binding.progressSaveCustomer.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.btnSaveCustomer.isEnabled = !isLoading
        binding.btnClearForm.isEnabled = !isLoading
        binding.etCustomerName.isEnabled = !isLoading
        binding.etPhone.isEnabled = !isLoading
        binding.etDob.isEnabled = !isLoading
        binding.etCustomerEmail.isEnabled = !isLoading
        binding.etAddress.isEnabled = !isLoading
    }
}
