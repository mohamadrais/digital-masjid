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

Finally, install rest of the packages:
```
npm install
```

Now you can build, install and run on your Android device:
```
ionic cordova run android
```
ionic cordova plugin add cordova-plugin-facebook4@1.7.4 --variable APP_ID="285153802177327" --variable APP_NAME="DigitalMasjid-dev"

ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID="com.googleusercontent.apps.440107685967-kduv0cpjrpivq0jqik70tnm1t38s1573" --variable PLAY_SERVICES_VERSION="15.+"
npm install --save @ionic-native/google-plus@4