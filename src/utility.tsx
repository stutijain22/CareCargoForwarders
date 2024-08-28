import {Linking, Platform, Share} from "react-native";
import { CommonActions, StackActions, useNavigation } from '@react-navigation/native';
import { setThemeJSON } from "./context";
import DeviceInfo from 'react-native-device-info';

export const getKeyboardHeight = (btnLocation: number) => {
    if (Platform.OS === 'ios') {
        return btnLocation;
    } else {
        return 0;
    }
};


export const getEssentials = () => {
    const navigation = useNavigation();
    const theme = setThemeJSON();

  return {navigation, theme}
};

// export const getDeviceDetails = async () => {

//     let deviceDetails: any = {
//         deviceType: "app",
//         deviceAppVersion: "1.0.0",
//         deviceCountry: "In",
//         deviceOs: Platform.OS,
//         deviceToken:"",
//         deviceUniqueId:""
//         // deviceFcmToken: await getData(key_setFcmToken)
//     };

//     await DeviceInfo.getUniqueId().then((uniqueId) => {
//         console.log(uniqueId);
//         deviceDetails.deviceUniqueId = uniqueId;
//     });
//     await DeviceInfo.getDeviceToken().then((deviceToken) => {
//         // iOS: "a2Jqsd0kanz..."
//         deviceDetails.deviceToken = deviceToken;
//       });
//     return deviceDetails;
// };

export const navigateScreen = (navigation: any, screenName: string, params?: object) => {
    if (params) {
        return navigation.navigate(screenName, params);
    } else {
        return navigation.navigate(screenName);
    }

};

export const resetScreen = ( navigation: any, screenName: string, params?: object ) => {
    navigation.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [
                { name: screenName, params },
            ],
        })
    );
};

export const popScreen = ( navigation: any, count: number ) => {
    navigation.dispatch(
        StackActions.pop(count)
    );
};

export const logout = async () => {
};


export const goBack = (navigation: any) => {
    return navigation.goBack();
};