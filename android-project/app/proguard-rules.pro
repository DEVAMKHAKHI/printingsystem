# Keep Firebase and Model classes safe from obfuscation if minify is enabled
-keepclassmembers class com.printcare.app.model.Customer {
    *;
}
