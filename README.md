# DigitalMasjid

### Prerequisites
Install Android Studio, NodeJS, Git and then Ionic & Cordova CLI globally:
```
npm install -g ionic
npm install -g cordova
```

After checkout, do:
```
npm install
```

Then install the following dependencies / plugins before build:
```
ionic cordova plugin add cordova-plugin-file-transfer
npm install --save @ionic-native/file-transfer@4

ionic cordova plugin add cordova-plugin-file
npm install --save @ionic-native/file@4

npm install --save ng-circle-progress@1.0.0
```

Now you can build, install and run on your Android device:
```
ionic cordova build android
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


-------------

Execution failed for task ':app:transformDexArchiveWithExternalLibsDexMergerForDebug'.
> java.lang.RuntimeException: java.lang.RuntimeException: com.android.builder.dexing.DexArchiveMergerException: Unable to merge dex

solution:
cordova clean android
