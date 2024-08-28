/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StackRouters } from './src/routers/StackRouters';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationListener, requestUserPermission, getFCM_Token, askPermission, requestNotificationPermission } from './src/pushnotification_helper';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

function App(): React.JSX.Element {
  // const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      await setStore();
      await requestCameraPermission()
      // let authToken = await getData('authToken');
      // setAuthToken(authToken as never);
    })();

    return () => {
      console.log('unmont')
      // this now gets called when the component unmounts
    };

  }, []);

  async function setStore() {
    await requestNotificationPermission();
    await requestUserPermission();
    await messaging()
      .hasPermission()
      .then(async enabled => {
        if (enabled) {
          console.log('User have the permission for Push notification');
          // user has permissions
          await getFCM_Token();
          await NotificationListener();
        } else {
          console.log('User do not have permission for Push notification');
          await askPermission();
        }
      });
  }

  const requestCameraPermission = async () => {
    let retrunType: boolean = false;
    if (Platform.OS === 'android') {
        
        try {
            const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]);

            let deviceVersion = DeviceInfo.getSystemVersion();
            if (parseInt(deviceVersion) >= 13) {
                retrunType = true;
            } else {
                if (
                    result['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    retrunType = true;
                } else {
                    retrunType = false;
                }
            }
        } catch (err) {
            console.log('err', err);
            retrunType = false;
        }

        return retrunType;

    } else {
        return true;
    }
};



  return (
    <SafeAreaProvider /*  style={backgroundStyle} */>
      {/* <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      /> */}
      <NavigationContainer >
        <StackRouters />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;

