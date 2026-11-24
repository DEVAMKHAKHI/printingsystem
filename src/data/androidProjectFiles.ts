import settingsGradle from '../../android-project/settings.gradle.kts?raw';
import rootBuildGradle from '../../android-project/build.gradle.kts?raw';
import gradleProperties from '../../android-project/gradle.properties?raw';
import firestoreRules from '../../android-project/firestore.rules?raw';
import appBuildGradle from '../../android-project/app/build.gradle.kts?raw';
import proguardRules from '../../android-project/app/proguard-rules.pro?raw';
import androidManifest from '../../android-project/app/src/main/AndroidManifest.xml?raw';

import customerKt from '../../android-project/app/src/main/java/com/printcare/app/model/Customer.kt?raw';
import validationUtilsKt from '../../android-project/app/src/main/java/com/printcare/app/utils/ValidationUtils.kt?raw';
import firebaseRepositoryKt from '../../android-project/app/src/main/java/com/printcare/app/repository/FirebaseRepository.kt?raw';
import customerAdapterKt from '../../android-project/app/src/main/java/com/printcare/app/adapter/CustomerAdapter.kt?raw';

import mainActivityKt from '../../android-project/app/src/main/java/com/printcare/app/ui/MainActivity.kt?raw';
import loginActivityKt from '../../android-project/app/src/main/java/com/printcare/app/ui/LoginActivity.kt?raw';
import signUpActivityKt from '../../android-project/app/src/main/java/com/printcare/app/ui/SignUpActivity.kt?raw';
import dashboardActivityKt from '../../android-project/app/src/main/java/com/printcare/app/ui/DashboardActivity.kt?raw';
import customerRegistrationActivityKt from '../../android-project/app/src/main/java/com/printcare/app/ui/CustomerRegistrationActivity.kt?raw';
import customerListActivityKt from '../../android-project/app/src/main/java/com/printcare/app/ui/CustomerListActivity.kt?raw';
import customerDetailActivityKt from '../../android-project/app/src/main/java/com/printcare/app/ui/CustomerDetailActivity.kt?raw';

import colorsXml from '../../android-project/app/src/main/res/values/colors.xml?raw';
import stringsXml from '../../android-project/app/src/main/res/values/strings.xml?raw';
import themesXml from '../../android-project/app/src/main/res/values/themes.xml?raw';
import menuCustomerListXml from '../../android-project/app/src/main/res/menu/menu_customer_list.xml?raw';

import activityMainXml from '../../android-project/app/src/main/res/layout/activity_main.xml?raw';
import activityLoginXml from '../../android-project/app/src/main/res/layout/activity_login.xml?raw';
import activitySignUpXml from '../../android-project/app/src/main/res/layout/activity_sign_up.xml?raw';
import activityDashboardXml from '../../android-project/app/src/main/res/layout/activity_dashboard.xml?raw';
import activityCustomerRegistrationXml from '../../android-project/app/src/main/res/layout/activity_customer_registration.xml?raw';
import activityCustomerListXml from '../../android-project/app/src/main/res/layout/activity_customer_list.xml?raw';
import activityCustomerDetailXml from '../../android-project/app/src/main/res/layout/activity_customer_detail.xml?raw';
import itemCustomerXml from '../../android-project/app/src/main/res/layout/item_customer.xml?raw';

import bgCircleBlueLightXml from '../../android-project/app/src/main/res/drawable/bg_circle_blue_light.xml?raw';
import bgIconBadgeXml from '../../android-project/app/src/main/res/drawable/bg_icon_badge.xml?raw';
import icPrintcareLogoXml from '../../android-project/app/src/main/res/drawable/ic_printcare_logo.xml?raw';
import icPersonXml from '../../android-project/app/src/main/res/drawable/ic_person.xml?raw';
import icPhoneXml from '../../android-project/app/src/main/res/drawable/ic_phone.xml?raw';
import icEmailXml from '../../android-project/app/src/main/res/drawable/ic_email.xml?raw';
import icCalendarXml from '../../android-project/app/src/main/res/drawable/ic_calendar.xml?raw';
import icLocationXml from '../../android-project/app/src/main/res/drawable/ic_location.xml?raw';
import icLockXml from '../../android-project/app/src/main/res/drawable/ic_lock.xml?raw';
import icSearchXml from '../../android-project/app/src/main/res/drawable/ic_search.xml?raw';
import icRefreshXml from '../../android-project/app/src/main/res/drawable/ic_refresh.xml?raw';
import icLogoutXml from '../../android-project/app/src/main/res/drawable/ic_logout.xml?raw';
import icAddCustomerXml from '../../android-project/app/src/main/res/drawable/ic_add_customer.xml?raw';
import icListCustomersXml from '../../android-project/app/src/main/res/drawable/ic_list_customers.xml?raw';
import icEmptyCustomersXml from '../../android-project/app/src/main/res/drawable/ic_empty_customers.xml?raw';
import icArrowForwardXml from '../../android-project/app/src/main/res/drawable/ic_arrow_forward.xml?raw';

export interface AndroidFileEntry {
  path: string;
  category: 'Gradle & Config' | 'Kotlin Source' | 'XML Layouts' | 'Resources & Values' | 'Drawables';
  language: 'kotlin' | 'xml' | 'gradle' | 'rules';
  summary: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFileEntry[] = [
  {
    path: 'settings.gradle.kts',
    category: 'Gradle & Config',
    language: 'gradle',
    summary: 'Project repositories and root module declaration for PrintCare.',
    content: settingsGradle,
  },
  {
    path: 'build.gradle.kts',
    category: 'Gradle & Config',
    language: 'gradle',
    summary: 'Project-level plugin versions (AGP 8.7.2, Kotlin 2.0.21, Google Services 4.4.2).',
    content: rootBuildGradle,
  },
  {
    path: 'gradle.properties',
    category: 'Gradle & Config',
    language: 'gradle',
    summary: 'AndroidX, Kotlin code style, and non-transitive R-class flags.',
    content: gradleProperties,
  },
  {
    path: 'app/build.gradle.kts',
    category: 'Gradle & Config',
    language: 'gradle',
    summary: 'App dependencies (Material 3, RecyclerView, SwipeRefreshLayout, Firebase BoM) and ViewBinding.',
    content: appBuildGradle,
  },
  {
    path: 'app/proguard-rules.pro',
    category: 'Gradle & Config',
    language: 'gradle',
    summary: 'ProGuard keep rule protecting Customer Firestore model fields.',
    content: proguardRules,
  },
  {
    path: 'firestore.rules',
    category: 'Gradle & Config',
    language: 'rules',
    summary: 'Cloud Firestore security rules enforcing authentication and schema validation.',
    content: firestoreRules,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'Gradle & Config',
    language: 'xml',
    summary: 'Application manifest registering all 7 Activities and Internet permissions.',
    content: androidManifest,
  },
  {
    path: 'app/src/main/java/com/printcare/app/model/Customer.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    summary: 'Firestore Customer data class with @ServerTimestamp createdAt.',
    content: customerKt,
  },
  {
    path: 'app/src/main/java/com/printcare/app/utils/ValidationUtils.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    summary: 'Form validation for Indian 10-digit mobile numbers, email, DOB, and address.',
    content: validationUtilsKt,
  },
  {
    path: 'app/src/main/java/com/printcare/app/repository/FirebaseRepository.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    summary: 'Centralized FirebaseAuth & Cloud Firestore repository with typed error mapping.',
    content: firebaseRepositoryKt,
  },
  {
    path: 'app/src/main/java/com/printcare/app/adapter/CustomerAdapter.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    summary: 'ViewBinding RecyclerView adapter displaying customer cards and click actions.',
    content: customerAdapterKt,
  },
  {
    path: 'app/src/main/java/com/printcare/app/ui/MainActivity.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    summary: 'Entry splash router checking FirebaseAuth session state.',
    content: mainActivityKt,
  },
  {
    path: 'app/src/main/java/com/printcare/app/ui/LoginActivity.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    summary: 'Email/password staff sign-in screen with validation and loading state.',
    content: loginActivityKt,
  },
  {
    path: 'app/src/main/java/com/printcare/app/ui/SignUpActivity.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    summary: 'Staff registration screen creating FirebaseAuth accounts with display name.',
    content: signUpActivityKt,
  },
  {
    path: 'app/src/main/java/com/printcare/app/ui/DashboardActivity.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    summary: 'Management dashboard showing customer count, quick actions, and logout dialog.',
    content: dashboardActivityKt,
  },
  {
    path: 'app/src/main/java/com/printcare/app/ui/CustomerRegistrationActivity.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    summary: 'Customer registration form with DatePickerDialog, validation, and Firestore save.',
    content: customerRegistrationActivityKt,
  },
  {
    path: 'app/src/main/java/com/printcare/app/ui/CustomerListActivity.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    summary: 'Customer list with RecyclerView, live search by name/phone, refresh, and empty/error states.',
    content: customerListActivityKt,
  },
  {
    path: 'app/src/main/java/com/printcare/app/ui/CustomerDetailActivity.kt',
    category: 'Kotlin Source',
    language: 'kotlin',
    summary: 'Detailed customer profile view with direct Dial and Email intents.',
    content: customerDetailActivityKt,
  },
  {
    path: 'app/src/main/res/layout/activity_main.xml',
    category: 'XML Layouts',
    language: 'xml',
    summary: 'Branded PrintCare splash screen layout.',
    content: activityMainXml,
  },
  {
    path: 'app/src/main/res/layout/activity_login.xml',
    category: 'XML Layouts',
    language: 'xml',
    summary: 'Material 3 login card with password visibility toggle.',
    content: activityLoginXml,
  },
  {
    path: 'app/src/main/res/layout/activity_sign_up.xml',
    category: 'XML Layouts',
    language: 'xml',
    summary: 'Staff sign-up form layout with confirm password field.',
    content: activitySignUpXml,
  },
  {
    path: 'app/src/main/res/layout/activity_dashboard.xml',
    category: 'XML Layouts',
    language: 'xml',
    summary: 'Print-shop dashboard with summary banner, action cards, and logout button.',
    content: activityDashboardXml,
  },
  {
    path: 'app/src/main/res/layout/activity_customer_registration.xml',
    category: 'XML Layouts',
    language: 'xml',
    summary: '5-field customer registration form with Save and Clear Form actions.',
    content: activityCustomerRegistrationXml,
  },
  {
    path: 'app/src/main/res/layout/activity_customer_list.xml',
    category: 'XML Layouts',
    language: 'xml',
    summary: 'Search bar, SwipeRefreshLayout, RecyclerView, loading, empty, and error views.',
    content: activityCustomerListXml,
  },
  {
    path: 'app/src/main/res/layout/activity_customer_detail.xml',
    category: 'XML Layouts',
    language: 'xml',
    summary: 'Full customer detail card with Call and Send Email buttons.',
    content: activityCustomerDetailXml,
  },
  {
    path: 'app/src/main/res/layout/item_customer.xml',
    category: 'XML Layouts',
    language: 'xml',
    summary: 'Rounded customer card showing initials, name, phone, email, DOB, and address.',
    content: itemCustomerXml,
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    category: 'Resources & Values',
    language: 'xml',
    summary: 'Blue, white, and cool slate PrintCare color palette.',
    content: colorsXml,
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    category: 'Resources & Values',
    language: 'xml',
    summary: 'Localized UI copy, labels, and plural customer count strings.',
    content: stringsXml,
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    category: 'Resources & Values',
    language: 'xml',
    summary: 'Material 3 Light theme and reusable rounded button/input styles.',
    content: themesXml,
  },
  {
    path: 'app/src/main/res/menu/menu_customer_list.xml',
    category: 'Resources & Values',
    language: 'xml',
    summary: 'Toolbar refresh menu action for CustomerListActivity.',
    content: menuCustomerListXml,
  },
  {
    path: 'app/src/main/res/drawable/bg_circle_blue_light.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Circular soft-blue avatar and logo backdrop.',
    content: bgCircleBlueLightXml,
  },
  {
    path: 'app/src/main/res/drawable/bg_icon_badge.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Rounded square icon container shape.',
    content: bgIconBadgeXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_printcare_logo.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Printing press / printer vector emblem.',
    content: icPrintcareLogoXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_person.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Customer person vector icon.',
    content: icPersonXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_phone.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Phone handset vector icon.',
    content: icPhoneXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_email.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Email envelope vector icon.',
    content: icEmailXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_calendar.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Date of birth calendar vector icon.',
    content: icCalendarXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_location.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Address location pin vector icon.',
    content: icLocationXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_lock.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Password lock vector icon.',
    content: icLockXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_search.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Search magnifier vector icon.',
    content: icSearchXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_refresh.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Refresh action vector icon.',
    content: icRefreshXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_logout.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Logout exit vector icon.',
    content: icLogoutXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_add_customer.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Add customer vector icon.',
    content: icAddCustomerXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_list_customers.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Customer directory group vector icon.',
    content: icListCustomersXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_empty_customers.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Empty state illustration icon.',
    content: icEmptyCustomersXml,
  },
  {
    path: 'app/src/main/res/drawable/ic_arrow_forward.xml',
    category: 'Drawables',
    language: 'xml',
    summary: 'Card chevron indicator icon.',
    content: icArrowForwardXml,
  },
];
