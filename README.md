# DigitalMasjid

### Prerequisites
Install Android Studio (ensure Android SDK Platform 26 is installed), Java Development Kit (JDK) 1.8 (required for Cordova build), NodeJS, Git and then Ionic & Cordova CLI globally:
```
npm install -g ionic
npm install -g cordova
```

Make sure following system variables are defined, below are default installation paths:
```
ANDROID_HOME --> C:\Users\username\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT --> C:\Users\username\AppData\Local\Android\Sdk
JAVA_HOME --> C:\Program Files\Java\jdk-version
PATH --> add following:
         %JAVA_HOME%\bin (mandatory)
         %ANDROID_HOME%\tools (mandatory)
		 %ANDROID_SDK_ROOT%\tools (mandatory)
         C:\Users\username\AppData\Local\Programs\Microsoft VS Code\bin (optional)
```

After checkout, do:
```
npm install
```

Then install the following dependencies / plugins before build:
```
ionic cordova plugin add cordova-android-support-gradle-release --fetch
```

Now you can build, install and run on your Android device:
```
ionic cordova build android
```

Make the following version changes in below file if build fails.
```
platforms\android\project.properties
cordova.system.library.4=com.google.firebase:firebase-core:16.0.8
cordova.system.library.5=com.google.firebase:firebase-messaging:17.5.0
cordova.system.library.6=com.google.firebase:firebase-config:16.4.1
cordova.system.library.7=com.google.firebase:firebase-perf:16.2.4
```

Once build is successful and your Android phone is plugged in, you can run on device:
```
ionic cordova run android
```

If build fail, you can try to remove/add platform before building again:
```
ionic cordova platform rm android
ionic cordova platform add android
```

Prod release command
```
ionic cordova build --prod --aot --release android
```

-------------
Known errors:

Error:
```
Execution failed for task ':app:transformDexArchiveWithExternalLibsDexMergerForDebug'.
> java.lang.RuntimeException: java.lang.RuntimeException: com.android.builder.dexing.DexArchiveMergerException: Unable to merge dex
```
Solution:
```
cordova clean android
```

-------------------------------------------

Steps on fixing Gradle issue since AndroidX release 
( https://developer.android.com/jetpack/androidx)

Run below in order
```
ionic cordova platform rm android
ionic cordova plugin remove cordova-plugin-firebase
cordova plugin add cordova-plugin-firebasex
ionic cordova platform add android@8.0.0
cordova plugin add cordova-plugin-androidx-adapter@1.1.0
cordova plugin add cordova-plugin-compat@1.2.0
```

In platforms>android>build.gradle, replace classpath 'com.google.gms:google-services:4.1.0' into classpath 'com.google.gms:google-services:4.2.0' if applicable.

Replace google-service.json in platform>android>src>main with our project version from android-build if applicable.

For error...
```
[string/fb_app_id] C:\dev\digital-masjid-frontend\platforms\android\app\src\main\res\values\facebookconnect.xml [string/fb_app_id] C:\dev\digital-masjid-frontend\platforms\android\app\src\main\res\values\strings.xml: Error: Duplicate resources
```
...resolve by deleting facebookconnect.xml in \platforms\android\app\src\main\res\values\facebookconnect.xml 

Note: need to figure how to put back .jks keystore file for publishing later





AAPT Process manager cannot be shut down while daemons are in useAAPT Process manager cannot be shut down while daemons are in useAAPT Process manager cannot be shut down while daemons are in useAAPT Process manager cannot be shut down while daemons are in useAAPT Process manager cannot be shut down while daemons are in use

install clipboard plugin

1. ionic cordova plugin add cordova-clipboard
2. npm install --save @ionic-native/clipboard@4

install buildinfo

1. cordova plugin add cordova-plugin-buildinfo