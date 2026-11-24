package com.printcare.app.ui

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.snackbar.Snackbar
import com.printcare.app.databinding.ActivityLoginBinding
import com.printcare.app.repository.FirebaseRepository
import com.printcare.app.utils.ValidationUtils

/**
 * Staff Login Screen backed by Firebase Email/Password Authentication.
 */
class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private val repository = FirebaseRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupListeners()
    }

    private fun setupListeners() {
        binding.btnLogin.setOnClickListener {
            attemptLogin()
        }

        binding.tvSignUpPrompt.setOnClickListener {
            startActivity(Intent(this, SignUpActivity::class.java))
        }
    }

    private fun attemptLogin() {
        val email = binding.etEmail.text?.toString().orEmpty()
        val password = binding.etPassword.text?.toString().orEmpty()

        val emailError = ValidationUtils.validateEmail(email)
        val passwordError = ValidationUtils.validatePassword(password)

        binding.tilEmail.error = emailError
        binding.tilPassword.error = passwordError

        if (emailError != null || passwordError != null) {
            return
        }

        setLoading(true)
        repository.loginUser(
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
        binding.progressLogin.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.btnLogin.isEnabled = !isLoading
        binding.etEmail.isEnabled = !isLoading
        binding.etPassword.isEnabled = !isLoading
        binding.tvSignUpPrompt.isEnabled = !isLoading
    }
}
