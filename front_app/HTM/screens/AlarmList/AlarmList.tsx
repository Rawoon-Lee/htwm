import { RefreshControl, StyleSheet, Text, View, Dimensions, ScrollView } from "react-native"
import Constants from "expo-constants"
import { notice } from "../../api/noticeAPI"
import AlarmBox from "./alarmBox"
import React, { useState } from "react"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getAlarmList, initAlarmList } from "../../store/notice"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

const wait = (timeout: number) => {
	return new Promise(resolve => setTimeout(resolve, timeout))
}

function AlarmList() {
	const dispatch = useAppDispatch()

	const userId = useAppSelector(state => state.userId)
	const alarmList = useAppSelector(state => state.alarmList)
	const [refreshing, setRefreshing] = React.useState(false)

	const onRefresh = React.useCallback(() => {
		setRefreshing(true)
		notice
			.getAlarms(userId.id)
			.then(result => {
				dispatch(getAlarmList(result.data.reverse()))
			})
			.catch(err => {
				console.log(err)
			})
		wait(1000).then(() => setRefreshing(false))
	}, [])

	const [fontsLoaded] = useFonts({
		"line-rg": require("../../assets/fonts/LINESeedKR-Rg.ttf"),
		"line-bd": require("../../assets/fonts/LINESeedKR-Bd.ttf")
	})

	React.useEffect(() => {
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
		notice
			.getAlarms(userId.id)
			.then(result => {
				dispatch(getAlarmList(result.data.reverse()))
			})
			.catch(err => {
				console.log(err)
			})
	}, [])

	const onLayoutRootView = React.useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync()
		}
	}, [fontsLoaded])

	if (!fontsLoaded) {
		return null
	}
	return (
		<View onLayout={onLayoutRootView} style={styles.container}>
			<View
				style={{
					width: width
				}}
			>
				<Text
					style={{
						fontSize: 30,
						paddingVertical: 10,
						paddingLeft: 20,
						fontFamily: "line-bd"
					}}
				>
					??????
				</Text>
			</View>
			<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				{alarmList.length >= 1 ? (
					alarmList.map((cur, idx) => {
						return (
							<View key={idx} style={{ marginVertical: 7 }}>
								<AlarmBox alarmData={cur}></AlarmBox>
							</View>
						)
					})
				) : (
					<Text style={{ fontFamily: "line-rg", fontSize: 20, textAlign: "center" }}>
						{" "}
						????????? ????????????.{" "}
					</Text>
				)}
			</ScrollView>
		</View>
	)
}

export default AlarmList

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		alignItems: "center",
		// paddingBottom: 45,
		backgroundColor: "white",
		flex: 1
	}
})
