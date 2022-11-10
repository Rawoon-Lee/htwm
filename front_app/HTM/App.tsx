import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View, Image, Platform } from "react-native"
import * as Device from "expo-device"
import { NavigationContainer } from "@react-navigation/native"
import { Provider } from "react-redux"
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack"
import * as React from "react"
import * as Notifications from "expo-notifications"

import BottomTabNav from "./components/BottomTabNav"
import { store } from "./store/store"

import CreateRoutine from "./screens/RoutinesList/createRoutine"
import FriendSearch from "./screens/FriendsList/friendSearch"
import ProfileEdit from "./screens/ProfileEdit/ProfileEdit"

import Constants from "expo-constants"

const Stack = createStackNavigator()
export default function App() {
	React.useEffect(() => {
		async function configurePushNotification() {
			if (Device.isDevice) {
				const { status: existingStatus } = await Notifications.getPermissionsAsync()
				let finalStatus = existingStatus
				if (existingStatus !== "granted") {
					const { status } = await Notifications.requestPermissionsAsync()
					finalStatus = status
				}
				if (finalStatus !== "granted") {
					alert("Failed to get push token for push notification!")
					return
				}
				const token = (await Notifications.getExpoPushTokenAsync()).data
				console.log(token)
				if (Platform.OS === "android") {
					Notifications.setNotificationChannelAsync("default", {
						name: "default",
						importance: Notifications.AndroidImportance.DEFAULT,
						vibrationPattern: [0, 250, 250, 250],
						lightColor: "#FF231F7C"
					})
				}
			} else {
				alert("Must use physical device for Push Notifications")
			}
		}

		configurePushNotification()
	}, [])
	return (
		<>
			<StatusBar style="light" backgroundColor="red" />
			<Provider store={store}>
				<NavigationContainer>
					<Stack.Navigator initialRouteName="BottomTabNav">
						<Stack.Screen
							name="BottomTabNav"
							component={BottomTabNav}
							options={{ headerShown: false }}
						></Stack.Screen>
						<Stack.Screen
							name="CreateRoutine"
							component={CreateRoutine}
							options={{
								title: "루틴 생성하기",
								gestureEnabled: true,
								headerBackTitle: "뒤로",
								headerBackTitleVisible: true,
								headerTitleAlign: "center",
								headerStatusBarHeight: Constants.statusBarHeight
							}}
						></Stack.Screen>
						<Stack.Screen
							name="FriendSearch"
							component={FriendSearch}
							options={{
								title: "친구 추가",
								gestureEnabled: true,
								headerBackTitle: "뒤로",
								headerBackTitleVisible: true,
								headerTitleAlign: "center",
								headerStatusBarHeight: Constants.statusBarHeight
							}}
						></Stack.Screen>
						<Stack.Screen
							name="ProfileEdit"
							component={ProfileEdit}
							options={{
								title: "회원정보 수정",
								gestureEnabled: true,
								headerBackTitle: "뒤로",
								headerBackTitleVisible: true,
								headerTitleAlign: "center",
								headerStatusBarHeight: Constants.statusBarHeight
							}}
						></Stack.Screen>
					</Stack.Navigator>
				</NavigationContainer>
			</Provider>
		</>
	)
}

const styles = StyleSheet.create({})
