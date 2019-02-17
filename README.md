# DigitalMasjid

### Prerequisites

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