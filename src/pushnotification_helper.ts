import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {AndroidImportance} from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
// import {key_setFcmToken} from "../constants/Constants";

export const storeData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error: any) {
        console.error('AsyncStorage storeData error: ' + error.message);
    }
};

export const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return value;
        }
    } catch (error: any) {
        console.error('AsyncStorage getData error: ' + error.message);
    }
};

export const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
        // return true
        let returnType = false;
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)  
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                returnType = true;
            } else {
                returnType = false;

            }
        } catch (err) {
            returnType = false;
        }
        return returnType;
    } else {
        return true;
    }
}

export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    // requestNotificationPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        await getFCM_Token()
    }
}


export const askPermission = async () => {
    await messaging()
        .requestPermission()
        .then(async permission => {
            if (permission !== 0) {
                await getFCM_Token();
            }
        })
        .catch(error => {
            console.log('user rejected the permission');
        });
};

export async function getFCM_Token() {
    let fcmToken = await getData('fcmToken');

    console.log('old token = ', fcmToken);

    if (!fcmToken){

        try {

            let fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log('new token = ', fcmToken);
                await storeData('fcmToken', fcmToken);
            } else {

            }

        } catch(e) {
            console.log('Error infcm token : ', e)
        }
    }

}

export const NotificationListener = (navigation?: any) => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
        );
    });

    // Check whether an initial notification is available
    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage,
                );
            }
        });


    messaging().onMessage(async remoteMessage => {


        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            sound: 'default',
            importance: AndroidImportance.HIGH,
        });

        console.log('notification on foreground state .......... ', remoteMessage);
    
        /* {"collapseKey": "com.myepulse.app", "data": {}, "from": "193954904660", "messageId": "0:1694598842024679%c2a1f157c2a1f157", "notification": {"android": {}, "body": "Your Business account has been registered successfully.", "title": "Business Registered Successfully."}, "sentTime": 1694598842006, "ttl": 2419200} */
        await notifee.displayNotification({
            title: remoteMessage && remoteMessage.notification && remoteMessage.notification.title,
            body: remoteMessage && remoteMessage.notification && remoteMessage.notification.body,
            android: {
                channelId ,
                sound: 'default',
                importance: AndroidImportance.HIGH,
            },
        });

        // if(remoteMessage?.notification?.title === "Business Approved Successfully.") {
        //     setTimeout(() => {
        //         console.log('setTimeout notification on foreground state .......... ', remoteMessage?.notification?.body);
        //         // resetScreen(navigation, "LoadingScreen")
        //         // resetScreen(navigation, S_AuthLoadingStack);
        //     }, 1000);
        // }
        
    })
};