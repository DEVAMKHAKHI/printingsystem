package com.printcare.app.ui

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.snackbar.Snackbar
import com.printcare.app.databinding.ActivitySignUpBinding
import com.printcare.app.repository.FirebaseRepository
import com.printcare.app.utils.ValidationUtils

/**
 * Staff Sign-Up Screen creating new Email/Password accounts in Firebase Authentication.
 */
class SignUpActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySignUpBinding
    private val repository = FirebaseRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignUpBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupListeners()
    }

    private fun setupListeners() {
        binding.toolbarSignUp.setNavigationOnClickListener {
            onBackPressedDispatcher.onBackPressed()
        }

        binding.btnSignUp.setOnClickListener {
            attemptSignUp()
        }

        binding.tvLoginPrompt.setOnClickListener {
            finish()
        }
    }

    private fun attemptSignUp() {
        val fullName = binding.etFullName.text?.toString().orEmpty()
        val email = binding.etEmail.text?.toString().orEmpty()
        val password = binding.etPassword.text?.toString().orEmpty()
        val confirmPassword = binding.etConfirmPassword.text?.toString().orEmpty()

        val nameError = ValidationUtils.validateStaffName(fullName)
        val emailError = ValidationUtils.validateEmail(email)
        val passwordError = ValidationUtils.validatePassword(password)
        val confirmError = ValidationUtils.validateConfirmPassword(password, confirmPassword)

        binding.tilFullName.error = nameError
        binding.tilEmail.error = emailError
        binding.tilPassword.error = passwordError
        binding.tilConfirmPassword.error = confirmError

        if (nameError != null || emailError != null || passwordError != null || confirmError != null) {
            return
        }

        setLoading(true)
        repository.registerStaffUser(
            fullName = fullName,
            email = email,
            password = password,
            onSuccess = {
                setLoading(false)
                val intent = Intent(this, DashboardActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                }
                startActivity(intent)
            },
            onError = { message ->
                setLoading(false)
                Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG).show()
            }
        )
    }

    private fun setLoading(isLoading: Boolean) {
        binding.progressSignUp.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.btnSignUp.isEnabled = !isLoading
        binding.etFullName.isEnabled = !isLoading
        binding.etEmail.isEnabled = !isLoading
        binding.etPassword.isEnabled = !isLoading
        binding.etConfirmPassword.isEnabled = !isLoading
    }
}
