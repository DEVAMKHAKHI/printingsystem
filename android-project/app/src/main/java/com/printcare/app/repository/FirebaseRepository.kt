package com.printcare.app.repository

import com.google.firebase.FirebaseNetworkException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseAuthInvalidCredentialsException
import com.google.firebase.auth.FirebaseAuthInvalidUserException
import com.google.firebase.auth.FirebaseAuthUserCollisionException
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.UserProfileChangeRequest
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.printcare.app.model.Customer

/**
 * Central repository handling all Firebase Authentication and Cloud Firestore operations.
 * Requires a valid google-services.json configured in the app module.
 */
class FirebaseRepository(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance(),
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance()
) {

    companion object {
        const val COLLECTION_CUSTOMERS = "customers"
    }

    private val customersCollection = firestore.collection(COLLECTION_CUSTOMERS)

    fun getCurrentUser(): FirebaseUser? = auth.currentUser

    fun isUserLoggedIn(): Boolean = auth.currentUser != null

    fun signOut() {
        auth.signOut()
    }

    fun loginUser(
        email: String,
        password: String,
        onSuccess: (FirebaseUser) -> Unit,
        onError: (String) -> Unit
    ) {
        auth.signInWithEmailAndPassword(email.trim(), password)
            .addOnSuccessListener { result ->
                val user = result.user
                if (user != null) {
                    onSuccess(user)
                } else {
                    onError("Unable to retrieve signed-in user profile.")
                }
            }
            .addOnFailureListener { exception ->
                onError(mapAuthError(exception))
            }
    }

    fun registerStaffUser(
        fullName: String,
        email: String,
        password: String,
        onSuccess: (FirebaseUser) -> Unit,
        onError: (String) -> Unit
    ) {
        auth.createUserWithEmailAndPassword(email.trim(), password)
            .addOnSuccessListener { result ->
                val user = result.user
                if (user == null) {
                    onError("Account created, but user session could not be loaded.")
                    return@addOnSuccessListener
                }
                val profileUpdates = UserProfileChangeRequest.Builder()
                    .setDisplayName(fullName.trim())
                    .build()

                user.updateProfile(profileUpdates)
                    .addOnCompleteListener {
                        onSuccess(user)
                    }
            }
            .addOnFailureListener { exception ->
                onError(mapAuthError(exception))
            }
    }

    /**
     * Generates a unique document ID automatically, writes the customer record to Firestore
     * with a server-side timestamp for createdAt, and invokes callbacks on completion.
     */
    fun saveCustomer(
        name: String,
        phone: String,
        dob: String,
        email: String,
        address: String,
        onSuccess: (String) -> Unit,
        onError: (String) -> Unit
    ) {
        if (auth.currentUser == null) {
            onError("Your session has expired. Please sign in again.")
            return
        }

        val docRef = customersCollection.document()
        val generatedId = docRef.id

        val customerPayload = hashMapOf(
            "customerId" to generatedId,
            "name" to name.trim(),
            "phone" to phone.trim(),
            "dob" to dob.trim(),
            "email" to email.trim(),
            "address" to address.trim(),
            "createdAt" to FieldValue.serverTimestamp()
        )

        docRef.set(customerPayload)
            .addOnSuccessListener {
                onSuccess(generatedId)
            }
            .addOnFailureListener { exception ->
                onError(exception.localizedMessage ?: "Failed to save customer record.")
            }
    }

    /**
     * Fetches all customer records ordered by most recently created first.
     */
    fun fetchAllCustomers(
        onSuccess: (List<Customer>) -> Unit,
        onError: (String) -> Unit
    ) {
        if (auth.currentUser == null) {
            onError("Authentication required. Please log in again.")
            return
        }

        customersCollection
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .get()
            .addOnSuccessListener { snapshot ->
                val customers = snapshot.documents.mapNotNull { doc ->
                    val parsed = doc.toObject(Customer::class.java)
                    if (parsed != null && parsed.customerId.isBlank()) {
                        parsed.copy(customerId = doc.id)
                    } else {
                        parsed
                    }
                }
                onSuccess(customers)
            }
            .addOnFailureListener { exception ->
                onError(exception.localizedMessage ?: "Failed to load customer records.")
            }
    }

    /**
     * Fetches total number of customers for Dashboard overview.
     */
    fun fetchCustomerCount(
        onSuccess: (Int) -> Unit,
        onError: (String) -> Unit
    ) {
        if (auth.currentUser == null) {
            onError("Not authenticated")
            return
        }
        customersCollection.get()
            .addOnSuccessListener { snapshot ->
                onSuccess(snapshot.size())
            }
            .addOnFailureListener { exception ->
                onError(exception.localizedMessage ?: "Unable to fetch customer count")
            }
    }

    private fun mapAuthError(exception: Exception): String {
        return when (exception) {
            is FirebaseAuthInvalidUserException ->
                "No account found with this email address. Please sign up first."
            is FirebaseAuthInvalidCredentialsException ->
                "Invalid email or password. Please check your credentials and try again."
            is FirebaseAuthUserCollisionException ->
                "An account with this email already exists. Please sign in instead."
            is FirebaseNetworkException ->
                "Network unavailable. Please check your internet connection."
            else ->
                exception.localizedMessage ?: "Authentication failed. Please try again."
        }
    }
}
