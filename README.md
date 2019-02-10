# DigitalMasjid

### Prerequisites

After checkout, do:
```
npm install
```


Then install the following dependencies / plugins before build:
```
ionic cordova plugin add cordova-plugin-device
npm install --save @ionic-native/device@4

ionic cordova plugin add cordova-plugin-statusbar
npm install --save @ionic-native/status-bar

npm install --save ng-circle-progress@1.0.0
```

Now you can build, install and run on your Android device:
```
ionic cordova build android
ionic cordova prepare android
```

If build fail, you can try to remove/add platform before building again:
```
ionic cordova platform rm android
ionic cordova platform add android
```
