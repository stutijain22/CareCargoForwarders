import React from "react";
import { Animated, StyleSheet } from "react-native";
import {
  createStackNavigator,
} from "@react-navigation/stack";
import { S_Dashboard, S_QRScan, S_SplashScreen } from "../constant/screenNameConstants";
import SplashScreen from "../screens/SplashScreen";
import Dashboard from "../screens/Dashboard";

const Stack = createStackNavigator();
/**
 * @Animation - ```customTransitionTopToBottom``` a top to bottom vertical sliding animation defined for the doctor setting screen,
 * which is call from the hamburger menu icon on the dashboard.
 * */

/**
 * @StackRouters - routers for the navigation in the application.
 * this function has multiple routers and stacks to simplify the routing in the application.
 * */
export const StackRouters = () => {
  return (
    <Stack.Navigator
      // screenOptions={{ gestureEnabled: false }}
      initialRouteName={S_SplashScreen}
    >
      <Stack.Screen name={S_SplashScreen} component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name={S_Dashboard} component={Dashboard} options={{ headerShown: false}} />
      {/* <Stack.Screen name={S_QRScan} component={QRScan} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
