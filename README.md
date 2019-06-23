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
JAVA_HOME --> C:\Program Files\Java\jdk-version
PATH --> add following:
         %JAVA_HOME%\bin (mandatory)
         %ANDROID_HOME%\tools (mandatory)
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
