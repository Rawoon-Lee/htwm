import { StyleSheet, Text, View, Image, Pressable, Platform, ScrollView } from "react-native"
import { StatusBar } from "expo-status-bar"
import Constants from "expo-constants"
import * as React from "react"

import { useAppSelector, useAppDispatch } from "../../store/hook"

import DeviceIntro from "./deviceIntro"
import ExerciseDays from "./exerciseDays"
import WeightGraph from "./weightGraph"
import WeightInput from "./weightInput"
import Header from "./header"
import AccumulatedInfo from "./accumalatedInfo"
import FriendCount from "./friendCount"

import TrainingBird from "./trainingBird"
import { getPushToken } from "../../store/user"
import * as Notifications from "expo-notifications"
import { Subscription } from "expo-modules-core"
import * as Device from "expo-device"

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true
	})
})

function Main({ navigation }: any) {
	const userUuid = useAppSelector(state => state.userUuid)
	const [notification, setNotification] = React.useState<Notifications.Notification>()
	const notificationListener = React.useRef<Subscription>()
	const responseListener = React.useRef<Subscription>()
	const dispatch = useAppDispatch()

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
				dispatch(getPushToken(token))
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
	React.useEffect(() => {
		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
			setNotification(notification)
		})

		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
			console.log(response)
		})

		return () => {
			if (
				typeof notificationListener.current !== "undefined" &&
				typeof responseListener.current !== "undefined"
			) {
				Notifications.removeNotificationSubscription(notificationListener.current)
				Notifications.removeNotificationSubscription(responseListener.current)
			}
		}
	})
	return (
		<View style={styles.container}>
			<ScrollView>
				<Header navigation={navigation}></Header>
				<StatusBar style="auto" />
				<TrainingBird></TrainingBird>
				{userUuid ? null : <DeviceIntro navigation={navigation}></DeviceIntro>}
				<View style={{ flexDirection: "row", marginTop: 10 }}>
					<FriendCount />
					<WeightInput></WeightInput>
				</View>
				<View style={{ flexDirection: "row" }}>
					<ExerciseDays></ExerciseDays>
					<AccumulatedInfo />
				</View>
				{/* <WeightGraph></WeightGraph> */}
			</ScrollView>
		</View>
	)
}

export default Main

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "flex-start",
		marginTop: Constants.statusBarHeight
	},
	text: {
		fontSize: 40
	}
})
