# DigitalMasjid

### Prerequisites

Install the following dependencies / plugins before build:
```
ionic cordova plugin add cordova-plugin-statusbar
npm install @ionic-native/status-bar

ionic cordova plugin add cordova-plugin-network-information
npm install --save @ionic-native/network

ionic cordova plugin add cordova-plugin-request-location-accuracy
npm install --save @ionic-native/location-accuracy

ionic cordova plugin add cordova.plugins.diagnostic
npm install --save @ionic-native/diagnostic

ionic cordova plugin add cordova-plugin-x-socialsharing
npm install --save @ionic-native/social-sharing

npm install ngx-filter-pipe --save

ionic cordova plugin add cordova-plugin-inappbrowser
npm install --save @ionic-native/in-app-browser

ionic cordova plugin add cordova-plugin-camera
npm install --save @ionic-native/camera

npm install ng-circle-progress@1.0.0 --save

npm install @types/googlemaps --save-dev
```

Go to node_modules folder > @types folder > googlemaps folder > open file index.d.ts > then add below line (after the last line & outside any function blocks)
```
declare module 'googlemaps';
```

Finally, install rest of the packages:
```
npm install
```

Now you can build, install and run on your Android device:
```
ionic cordova run android
```
