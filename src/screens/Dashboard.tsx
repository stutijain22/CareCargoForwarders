import React, { useCallback, useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { ActivityIndicator, Image, PermissionsAndroid, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { deviceHeight, deviceWidth } from '../styling/mixin';
import { CROSS_BLACK, SPLASH_IMAGE } from '../sharedImages';
import TextComponent from '../common/TextComponent';
import DeviceInfo from 'react-native-device-info';
import { getData } from '../pushnotification_helper';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { getEssentials, navigateScreen, resetScreen } from '../utility';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

const Dashboard = () => {
    const isfocused = useIsFocused()
    const [redirectUrl, setRedirectUrl] = useState<any>('https://carecargoforwarders.com/crm/ccf/');
    const [previousUrl, setPreviousUrl] = useState<any>('');
    const [deviceUniqueId, setDeviceUniqueId] = useState<any>('');
    const [deviceFcmToken, setDeviceFcmToken] = useState<any>('');
    const { navigation, theme } = getEssentials();
    const [isModalVisible, setIsModalVisible] = useState(false);
    // const [isModalVisible, setIsModalVisible] = useState(false);
    const [qrScannerLink, setQRScannerLink] = useState<any>('');
    const qrScannerRef: any = useRef(null);
    let viewShotRef = useRef<any>()
    const webviewRef = useRef<any>(null)
    // console.log("Dddddddddddddddddddd", url);
    // console.log("22222222222222222", redirectUrl);

    useEffect(() => {
        (async () => {
            await DeviceInfo.getUniqueId().then((uniqueId) => {
                setDeviceUniqueId(uniqueId)
            });

            let FcmToken = await getData('fcmToken');
            await setDeviceFcmToken(FcmToken)
            // setTimeout(() => { resetScreen(navigation, S_Dashboard) }, 3000)
        })();
    }, []);

    const onCapture = useCallback((uri: any) => { console.log(uri) }, []);

    const takeScreenshot = (data: any) => {
        viewShotRef.current.capture().then(
            async (uri: any) => {
                console.log(uri)
                await shareScreenshot(uri, data)
            }
        )
    }

    const shareScreenshot = async (uri: any, dataText: any) => {
        try {
            await Share.open({
                url: uri,
                message: dataText
            });
        } catch (error) {
            console.error('Error sharing screenshot:', error);
            //   Alert.alert('Error', 'Failed to share screenshot');
        }
    };

    // const requestCameraPermission = async () => {
    //     let retrunType: boolean = false;
    //     if (Platform.OS === 'android') {
    //         try {
    //             const result = await PermissionsAndroid.requestMultiple([
    //                 PermissionsAndroid.PERMISSIONS.CAMERA,
    //                 PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //                 PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //             ]);

    //             let deviceVersion = DeviceInfo.getSystemVersion();
    //             if (parseInt(deviceVersion) >= 13) {
    //                 setIsModalVisible(true);
    //                 retrunType = true;
    //             } else {
    //                 if (
    //                     result['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
    //                     result['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
    //                     result['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
    //                 ) {
    //                     setIsModalVisible(true);
    //                     // navigateScreen(navigation, S_QRScan, {
    //                     //     previousUrl: previousUrl
    //                     // })
    //                     /* ,{
    //                         isModalVisible:isModalVisible,
    //                         setIsModalVisible:setIsModalVisible
    //                     } */
    //                     retrunType = true;
    //                 } else {
    //                     setIsModalVisible(false);
    //                     retrunType = false;
    //                 }
    //             }
    //         } catch (err) {
    //             console.log('err', err);
    //             setIsModalVisible(false);
    //             retrunType = false;
    //         }

    //         return retrunType;

    //     } else {
    //         return true;
    //     }
    // };



    const onSuccess = async (e: any) => {
        if (e?.data?.includes("https://carecargoforwarders.com/crm")) {
            console.log("eeeeeeeeeeeeeeeeeeeeeeeee", e?.data);
            setIsModalVisible(false)
            await setRedirectUrl(e?.data)
        } else {
            await setIsModalVisible(false)
        }
    }

    const onNavigationStateChange = async (webViewState: any) => {
        console.log("dataaaaaaaaaaaaaaaaaaaaaa", webViewState);

        // if (webViewState?.url?.includes("get-ccf-info")) {
        //     console.log("11111111111111", webViewState);
        //     let data = webViewState?.url?.split("/").reverse();
        //     let data1 = `https://carecargoforwarders.com/crm/customer/AdminController/api_device_info?method=post&customer_id=${data[1]}&device_unique_id=${deviceUniqueId}&device_token=${deviceFcmToken}&type=${data[0]}`
        //     console.log("333333333333333333", data1);
        //     await setPreviousUrl(webViewState?.url)
        //     await setRedirectUrl(data1);
        // }
        // else if (webViewState?.url?.includes("open-camera-for-scan")) {
        //     // await setRedirectUrl(data1);
        //     await setIsModalVisible(true);
        //     // await requestCameraPermission()
        // } else {
        //     await setRedirectUrl(webViewState?.url);
        // }

    }

    console.log("33333333333333333333", redirectUrl);

    const onShouldStartLoadWithRequest = (event: any) => {
        console.log("eeeeeeeeeeeeeeeeeee",event);
        
        if (event?.url?.includes("get-ccf-info")) {
            (async () => {
                console.log("11111111111111", event);
                let data = event?.url?.split("/").reverse();
                let data1 = `https://carecargoforwarders.com/crm/customer/AdminController/api_device_info?method=post&customer_id=${data[1]}&device_unique_id=${deviceUniqueId}&device_token=${deviceFcmToken}&type=${data[0]}`
                console.log("333333333333333333", data1);
                await setPreviousUrl(event?.url)
                await setRedirectUrl(data1);
            })();
        }
        else if (event?.url?.includes("?detail=")) {
            (async () => {
                console.log("11111111111111", event);
                let data = event?.url?.split("?detail=");
                // let data1 = `https://carecargoforwarders.com/crm/customer/AdminController/api_device_info?method=post&customer_id=${data[1]}&device_unique_id=${deviceUniqueId}&device_token=${deviceFcmToken}&type=${data[0]}`
                const data1 = data[1].replace('%20', ' ')
                console.log("333333333333333333", data1);

                // await setTextSend(data1)
                await takeScreenshot(data1)
            })();
            return false;
        }
        else if (event?.url?.includes("open-camera-for-scan")) {
            (async () => {
                // await setRedirectUrl(data1);
                await setIsModalVisible(true);
            })();
            return false;
            // await requestCameraPermission()
        } else {
            (async () => {
                await setRedirectUrl(event?.url);
            })();
            return false;
        }
        return true;
    }


    return (
        <View style={{ flex: 1, }}>
            {isModalVisible && <TouchableOpacity
                onPress={() => {
                    setIsModalVisible(false)
                    setRedirectUrl(redirectUrl)
                }
                }
                style={{
                    alignItems: "flex-end", marginTop: 20, marginRight: 10,
                    alignSelf: 'flex-end', justifyContent: "center",
                    width: 25, height: 25,
                }}>
                <Image resizeMode={'contain'}
                    tintColor={'#000000'}
                    source={CROSS_BLACK}
                    height={20} width={20}
                />
            </TouchableOpacity>}
            {!isModalVisible ?
                <ViewShot
                    ref={viewShotRef}
                    onCapture={onCapture}
                    style={{ width: deviceWidth, height: deviceHeight }}
                >
                    <WebView
                        // ref={webViewRef}
                        bounces={true}
                        // onOpenWindow
                        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        // scalesPageToFit={true}
                        // cacheEnabled={false}
                        // renderLoading={() =>
                        //     <ActivityIndicator style={{
                        //         flex: 1, alignItems: 'center',
                        //         justifyContent: 'center'
                        //     }} size="large" />}
                        onNavigationStateChange={(webViewState) => onNavigationStateChange(webViewState)}
                        javaScriptEnabled
                        source={{ uri: redirectUrl }} style={{ flex: 1 }} />
                </ViewShot>
                :
                <View style={{
                    flex: 1,
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <QRCodeScanner
                        ref={qrScannerRef}
                        onRead={onSuccess}
                        fadeIn
                        showMarker
                        reactivate
                        // cameraTimeout={3000}
                        // containerStyle={{}}
                        // topViewStyle={{ backgroundColor: 'black' }}
                        // containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                        // cameraContainerStyle={{ backgroundColor: 'pink', }}
                        // cameraStyle={{ backgroundColor: 'yellow' }}
                        // cameraType=''
                        flashMode={RNCamera.Constants.FlashMode.auto}
                    // checkAndroid6Permissions
                    // permissionDialogMessage=''
                    // topContent={
                    //     <TouchableOpacity /* onPress={() => setRedirectUrl(qrScannerLink)} */>
                    //         <TextComponent fontSize={20} color='black' value={qrScannerLink} />
                    //     </TouchableOpacity>
                    // }
                    // bottomContent={
                    //     <TouchableOpacity onPress={(e) => navigateScreen(navigation, S_Dashboard)}>
                    //         <TextComponent fontSize={25} color='black' value={'EXIT'} />
                    //     </TouchableOpacity>
                    // }
                    />
                </View>
            }
        </View>
    );
};

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: "center",
    },
});

export default Dashboard;