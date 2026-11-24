package com.printcare.app.model

import com.google.firebase.Timestamp
import com.google.firebase.firestore.ServerTimestamp

/**
 * Data model representing a registered customer in the PrintCare Firestore 'customers' collection.
 * No-argument constructor values are provided for Firebase Firestore automatic deserialization.
 */
data class Customer(
    val customerId: String = "",
    val name: String = "",
    val phone: String = "",
    val dob: String = "",
    val email: String = "",
    val address: String = "",
    @ServerTimestamp
    val createdAt: Timestamp? = null
)
