package com.printcare.app.ui

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import com.printcare.app.databinding.ActivityMainBinding
import com.printcare.app.repository.FirebaseRepository

/**
 * Entry launcher activity that checks the existing FirebaseAuth session
 * and routes either to DashboardActivity or LoginActivity.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val repository = FirebaseRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        Handler(Looper.getMainLooper()).postDelayed({
            val destination = if (repository.isUserLoggedIn()) {
                DashboardActivity::class.java
            } else {
                LoginActivity::class.java
            }
            startActivity(Intent(this, destination))
            finish()
        }, 700L)
    }
}
