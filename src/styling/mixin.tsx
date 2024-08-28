import {Dimensions, Platform, StatusBar} from 'react-native';
// import {isIphoneX} from '../utils/iPhoneXHelper';

const { width, height } = Dimensions.get('window');
export const deviceWidth = Platform.OS === 'ios' ? Dimensions.get('window').width : Dimensions.get('window').width;
export const deviceHeight = Platform.OS === 'ios' ? Dimensions.get('window').height : Dimensions.get('window').height;

export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;

const bWidth = width >= 390 ? 428 : 390;
const bHeight = height >= 844 ? 926 : 844;

const baseWidth = bWidth;
const baseHeight = bHeight;
const scaleWidth = width / deviceWidth;
const scaleHeight = height / deviceHeight;

export const scaleSize = (size: number) => {
    return scaleWidth * size;
};

export const scaleFont = (size: number) => ( scaleHeight * size ) / bHeight;

export function RFValue(size: number) {
    const { height, width } = Dimensions.get("window");
    const standardLength = width > height ? width : height;
    const offset = width > height ? 0 : Platform.OS === "ios" ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

    const deviceHeight =/*  isIphoneX() || Platform.OS === "android" ? */ standardLength - offset /* : standardLength */;

    const heightPercent = (size * deviceHeight) / bHeight;
    return Math.round(heightPercent);
}