export interface ReportChapter {
  number: number;
  title: string;
  body: string;
}

export const PROJECT_REPORT_CHAPTERS: ReportChapter[] = [
  {
    number: 1,
    title: 'Title Page',
    body: `PROJECT TITLE: PrintCare – Printing Shop Customer Management System
COURSE / SUBJECT: Mobile Application Development (Android – Kotlin & Firebase)
PLATFORM: Native Android (API Level 24 – 35)
BACKEND & DATABASE: Google Firebase Authentication & Cloud Firestore
SUBMITTED BY: [Student Name] ([Roll Number / Enrollment ID])
GUIDED BY: [Faculty Guide Name], Department of Computer Engineering / Information Technology
INSTITUTION: [College / University Name]
ACADEMIC YEAR: 2026 – 2027`,
  },
  {
    number: 2,
    title: 'Abstract',
    body: `PrintCare is a native Android application built in Kotlin using Material Design 3 components and Google Firebase services to modernize customer record management for small and medium-sized printing shops. Traditional printing businesses frequently rely on paper registers or scattered spreadsheets to store customer contact details, causing retrieval delays, duplicate records, and data loss.

PrintCare solves this challenge by providing shop staff with secure email-and-password authentication via Firebase Authentication, an intuitive Customer Management Dashboard, a validated Customer Registration Form tailored for Indian mobile numbers and structured dates, and a searchable Customer Directory backed by Cloud Firestore. All customer documents are automatically assigned unique identifiers and server timestamps, enabling reliable cloud persistence and instant lookup across devices.`,
  },
  {
    number: 3,
    title: 'Introduction',
    body: `Commercial printing shops handle recurring orders such as visiting cards, wedding invitations, flex banners, brochures, stationery, and custom packaging. Maintaining accurate customer profiles is vital for follow-up communication, repeat print runs, and proof approvals.

Mobile-first tools offer immediate accessibility right at the shop counter without requiring expensive desktop infrastructure. PrintCare leverages Kotlin, Android ViewBinding, Material Components, RecyclerView, and Firebase Cloud Firestore to deliver a lightweight, responsive, and secure customer management system tailored specifically to printing shop workflows.`,
  },
  {
    number: 4,
    title: 'Problem Statement',
    body: `Most local printing shops record client details—such as customer name, phone number, email address, date of birth, and delivery address—in physical notebooks or unindexed messaging threads. This manual workflow leads to:
1. Slow retrieval when returning customers request reprints or invoice updates.
2. Frequent transcription errors, invalid 9-digit/11-digit phone entries, and incomplete addresses.
3. Zero centralized backup if a register is damaged or misplaced.
4. No role-gated access control to protect customer contact records.

Therefore, there is a clear need for a dedicated, mobile-native application with strict client-side validation and cloud-synchronized storage.`,
  },
  {
    number: 5,
    title: 'Objectives',
    body: `The primary objectives of PrintCare are:
- To provide secure staff login and account registration using Firebase Authentication.
- To design a clean, uncluttered Material Design 3 dashboard for printing shop staff.
- To enforce strict form validation, including 10-digit Indian mobile number checks (starting with digits 6–9), email format checks, DatePicker-based DOB selection, and multiline address validation.
- To persist customer records securely in Firebase Cloud Firestore with auto-generated customerId values and server-side createdAt timestamps.
- To display customer records in a RecyclerView with real-time search by name or phone number, pull-to-refresh, loading/empty/error states, and a detailed contact screen.`,
  },
  {
    number: 6,
    title: 'Scope of the Project',
    body: `In-Scope Features:
- Staff authentication (Sign In, Sign Up, Session Persistence, Logout).
- Management Dashboard displaying live customer totals and navigation cards.
- Customer Registration module storing records in the Firestore 'customers' collection.
- Customer List module with RecyclerView rendering, swipe-to-refresh, search filtering, and Customer Detail inspection with one-tap Dial and Email intents.
- Firestore security rules restricting read/write access to authenticated shop staff and validating document fields.

Out-of-Scope (Reserved for Future Versions):
- Print job order ticketing, GST billing/invoicing, and payment gateway integration.`,
  },
  {
    number: 7,
    title: 'Software and Hardware Requirements',
    body: `Software Requirements:
- Operating System (Development): Windows 10/11, macOS, or Linux (64-bit)
- IDE: Android Studio Ladybug / Meerkat (2024.2+)
- Programming Language: Kotlin 2.0.21
- Build System: Gradle (Kotlin DSL) with AGP 8.7.2
- Target Platform: Android 7.0 Nougat (API 24) to Android 15 (API 35)
- Cloud Services: Firebase Console (Authentication + Cloud Firestore)

Hardware Requirements (Development Machine):
- Processor: Intel Core i5 / AMD Ryzen 5 or Apple Silicon M-series
- RAM: 8 GB minimum (16 GB recommended for Android Emulator)
- Storage: 10 GB free disk space for Android SDK and Gradle cache

Hardware Requirements (Target Mobile Device):
- Any Android smartphone running Android 7.0+ with minimum 2 GB RAM and active internet connectivity.`,
  },
  {
    number: 8,
    title: 'Technology Stack',
    body: `- Language: Kotlin (null-safe, concise modern Android language)
- UI Toolkit: XML Layouts with Material Design 3 (com.google.android.material:material:1.12.0)
- View Access: Android ViewBinding (eliminates findViewById boilerplate and null-pointer risks)
- List Rendering: AndroidX RecyclerView & SwipeRefreshLayout
- Authentication: Firebase Authentication (Email/Password provider via Firebase BoM 33.7.0)
- Cloud Database: Firebase Cloud Firestore (NoSQL document store with offline cache)
- Architecture Pattern: Repository-backed Activity architecture (UI -> ValidationUtils / FirebaseRepository -> Firebase SDK)`,
  },
  {
    number: 9,
    title: 'System Architecture',
    body: `PrintCare follows a clean layered architecture:
1. Presentation Layer (Activities & XML Layouts): MainActivity, LoginActivity, SignUpActivity, DashboardActivity, CustomerRegistrationActivity, CustomerListActivity, CustomerDetailActivity, and CustomerAdapter.
2. Validation Layer (ValidationUtils): Pure stateless functions verifying email patterns, password length, Indian 10-digit mobile numbers, DD/MM/YYYY dates, and address bounds before any network request is dispatched.
3. Data / Repository Layer (FirebaseRepository): Abstracts FirebaseAuth and FirebaseFirestore calls behind clean callback interfaces and maps Firebase exceptions to readable user messages.
4. Cloud Backend Layer (Firebase): Firebase Authentication manages JWT sessions; Cloud Firestore enforces security rules and persists documents inside the 'customers' collection.`,
  },
  {
    number: 10,
    title: 'Application Flowchart',
    body: `[App Launch (MainActivity)]
       |
       v
[Is FirebaseAuth currentUser != null?]
   |                         |
  No                        Yes
   |                         |
   v                         v
[LoginActivity] <-----> [SignUpActivity]
   |
   | (Valid Auth)
   v
[DashboardActivity]
   |-------------------------------|-------------------------------|
   v                               v                               v
[Register New Customer]     [View Registered Customers]        [Logout Dialog]
   |                               |                               |
   v                               v                               v
[Validate 5 Fields]         [Fetch Firestore 'customers']      [Sign Out -> Login]
   |                               |
   v                               v
[Save to Firestore]         [Search / Pull-to-Refresh]
   |                               |
   v                               v
[Success Dialog]            [Tap Card -> CustomerDetailActivity (Call / Email)]`,
  },
  {
    number: 11,
    title: 'Database Design',
    body: `Cloud Firestore stores data in a NoSQL collection-document hierarchy.

Collection Name: customers
Document ID: Auto-generated Firestore ID (stored inside customerId field)

Document Schema:
- customerId (String): Unique identifier matching the Firestore document ID.
- name (String): Customer full name (2–100 characters).
- phone (String): 10-digit Indian mobile number matching ^[6-9][0-9]{9}$.
- dob (String): Date of birth formatted as DD/MM/YYYY.
- email (String): Validated customer email address.
- address (String): Multiline residential or shop delivery address (5–400 characters).
- createdAt (Timestamp): Server-assigned creation timestamp (FieldValue.serverTimestamp()).

Indexing: Default single-field index on createdAt enables DESCENDING sort order so newly registered customers appear at the top of the directory.`,
  },
  {
    number: 12,
    title: 'Firebase Integration',
    body: `PrintCare integrates Firebase via the Google Services Gradle plugin and Firebase BoM (33.7.0):
1. Project Registration: Package name 'com.printcare.app' is registered in Firebase Console, generating google-services.json placed inside app/.
2. Authentication: Email/Password sign-in provider is enabled in Firebase Authentication. User sessions persist automatically across app restarts.
3. Cloud Firestore: Provisioned in production mode with custom firestore.rules verifying request.auth != null and enforcing strict schema validation on every create/update operation.
4. Secret Hygiene: No API secrets or private keys are hardcoded in Kotlin source files; configuration relies solely on the project's google-services.json and authenticated Firebase SDK calls.`,
  },
  {
    number: 13,
    title: 'Module Description',
    body: `1. Authentication Module (MainActivity, LoginActivity, SignUpActivity): Handles splash session routing, staff login with password toggle, staff sign-up with display name update, and user-friendly auth error mapping.
2. Dashboard Module (DashboardActivity): Greets the signed-in staff member, queries total customer count, provides large Material cards for primary workflows, and confirms sign-out via MaterialAlertDialogBuilder.
3. Customer Registration Module (CustomerRegistrationActivity, ValidationUtils): Collects customer inputs, launches DatePickerDialog capped at the current date, runs field-by-field validation, and persists records via FirebaseRepository.
4. Customer Directory Module (CustomerListActivity, CustomerAdapter, CustomerDetailActivity): Loads records sorted by createdAt descending, supports real-time search by name or phone number, handles swipe-to-refresh, empty/error states, and opens CustomerDetailActivity with Call/Email intents.`,
  },
  {
    number: 14,
    title: 'Screen / UI Description',
    body: `The UI adheres to a cohesive Printing-Shop theme using Blue (#1D4ED8), Crisp White (#FFFFFF), and Subtle Slate (#F8FAFC / #E2E8F0):
- Login Screen: Centered PrintCare vector logo, rounded MaterialCardView container, outlined email/password inputs with endIconMode password toggle, primary Sign In button, and Create Account link.
- Dashboard Screen: Blue summary banner displaying personalized greeting and total customer count, followed by two white elevated action cards and a red-accented Logout button.
- Customer Registration Screen: Top toolbar with back arrow, 5 outlined TextInputLayouts (+91 prefix on Phone, read-only clickable DOB field), Save Customer primary button, and Clear Form outlined button.
- Customer List Screen: Top search input filtering by name/phone, customer count indicator, SwipeRefreshLayout wrapping RecyclerView cards, centered empty-state illustration, and Customer Detail view with Call & Email actions.`,
  },
  {
    number: 15,
    title: 'Implementation Details',
    body: `- ViewBinding: Enabled in app/build.gradle.kts (viewBinding = true). Every Activity inflates its strongly typed binding class (e.g., ActivityCustomerRegistrationBinding), preventing runtime view-ID mismatches.
- Indian Phone Validation: ValidationUtils.validateIndianPhone applies Regex("^[6-9][0-9]{9}$") paired with maxLength="10" and +91 prefix text in XML.
- Date Picker: CustomerRegistrationActivity opens DatePickerDialog with maxDate = System.currentTimeMillis() and formats output via String.format("%02d/%02d/%04d", ...).
- Automatic ID & Server Timestamp: FirebaseRepository generates customersCollection.document().id prior to writing and sets "createdAt" to FieldValue.serverTimestamp(), ensuring consistent chronological ordering independent of device clock drift.`,
  },
  {
    number: 16,
    title: 'Testing and Test Cases',
    body: `TC-01 | Login Empty Fields | Leave email/password empty, tap Sign In | Validation error shown under both fields; no Firebase call made | Pass
TC-02 | Login Invalid Password | Enter valid email + wrong password | Snackbar displays readable invalid credential message | Pass
TC-03 | Staff Sign Up | Enter name, valid email, 6+ char matching password | FirebaseAuth creates user, updates profile, opens Dashboard | Pass
TC-04 | Phone Validation | Enter '5123456789' or '98765' in registration form | tilPhone shows 'Enter a valid 10-digit Indian mobile number starting with 6–9' | Pass
TC-05 | DOB Picker | Tap Date of Birth field | DatePickerDialog opens; future dates disabled; selection formats as DD/MM/YYYY | Pass
TC-06 | Save Customer | Fill all 5 valid fields, tap Save Customer | Document created in Firestore 'customers' with auto customerId and server createdAt | Pass
TC-07 | Search Customer | Type 'Rohan' or '98112' in Customer List search bar | RecyclerView filters live to matching record(s) | Pass
TC-08 | Empty Search State | Type 'zzzzz' in search bar | Empty state view displays 'No Matching Customers' message | Pass
TC-09 | Customer Detail | Tap a customer card | CustomerDetailActivity displays all fields; Call/Email buttons launch system Dialer/Email apps | Pass
TC-10 | Logout | Tap Logout on Dashboard and confirm | FirebaseAuth signs out and returns to LoginActivity clearing back stack | Pass`,
  },
  {
    number: 17,
    title: 'Sample Firebase Data',
    body: `Ten realistic Indian customer records (PC_2026_001 through PC_2026_010) are included in the Firebase & Dummy Data section of this package. Each document follows the exact Firestore schema:
- customerId: e.g., "PC_2026_001"
- name: e.g., "Aarav Rajesh Kulkarni"
- phone: e.g., "9820411523"
- dob: e.g., "14/05/1992"
- email: e.g., "aarav.kulkarni@example.in"
- address: e.g., "Shop 4, Saraswati Arcade, Paud Road, Kothrud, Pune, Maharashtra 411038"
- createdAt: Firestore Timestamp

These records can be inserted directly via Firebase Console -> Cloud Firestore -> Start collection 'customers' -> Add document.`,
  },
  {
    number: 18,
    title: 'Results and Screenshots Placeholders',
    body: `During execution and demonstration on an Android 14 (API 34) emulator and physical Android device, all screens rendered smoothly within the Material Design 3 Blue/White theme, forms rejected malformed inputs cleanly, and Firestore read/write latency remained under 1 second on standard 4G/Wi-Fi connections.

[Placeholder Figure 18.1: Login & Sign-Up Screen Screenshot]
[Placeholder Figure 18.2: PrintCare Management Dashboard Screenshot]
[Placeholder Figure 18.3: Customer Registration Form with DatePickerDialog Screenshot]
[Placeholder Figure 18.4: Customer List RecyclerView & Search Filter Screenshot]
[Placeholder Figure 18.5: Customer Detail Screen & Firebase Console Firestore View Screenshot]`,
  },
  {
    number: 19,
    title: 'Limitations',
    body: `1. Requires active internet connectivity for initial login and real-time cloud synchronization across multiple shop devices (though Firestore local cache assists temporary offline reads).
2. Current version focuses strictly on customer profile management and does not yet track individual print job orders, paper sizes, or invoice totals.
3. All authenticated shop staff share read/create access to the customer directory without granular Admin vs. Counter-Staff role separation.`,
  },
  {
    number: 20,
    title: 'Future Enhancements',
    body: `- Print Job Order Tracking: Link each customerId to a subcollection of print orders (visiting cards, banners, brochures, delivery due dates, and job status).
- Automated WhatsApp & SMS Alerts: Notify customers automatically when print proofs are ready or orders are dispatched.
- PDF Invoice & GST Receipt Generation: Generate shareable GST-compliant bills directly from the customer detail screen.
- Edit & Soft-Delete Support: Allow authorized managers to update customer addresses or archive inactive accounts.
- Role-Based Access Control (RBAC): Differentiate Shop Owners from Counter Staff using Firebase Custom Claims.`,
  },
  {
    number: 21,
    title: 'Conclusion',
    body: `PrintCare successfully fulfills the objective of replacing error-prone manual customer registers in printing shops with a reliable, modern native Android application. By combining Kotlin, ViewBinding, Material Design 3, Firebase Authentication, and Cloud Firestore, the application delivers fast customer onboarding, accurate Indian phone and email validation, instant searchability, and secure cloud persistence—making it both practical for real-world counter operations and well-structured for academic demonstration.`,
  },
];
