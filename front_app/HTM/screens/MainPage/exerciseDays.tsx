import { StyleSheet, Text, View, Dimensions } from "react-native"
import * as React from "react"

import { record } from "../../api/recordAPI"
import { useAppSelector } from "../../store/hook"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width
function ExerciseDays() {
	const userId = useAppSelector(state => state.userId)
	const [daysCont, setDaysCont] = React.useState("0")

	const [fontsLoaded] = useFonts({
		"line-rg": require("../../assets/fonts/LINESeedKR-Rg.ttf"),
		"line-bd": require("../../assets/fonts/LINESeedKR-Bd.ttf")
	})

	React.useEffect(() => {
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
		let today = new Date()
		let year = today.getFullYear()
		let month = ("0" + (today.getMonth() + 1)).slice(-2)
		let day = ("0" + (today.getDate() - 1)).slice(-2)
		let dateString = year + "-" + month + "-" + day
		let data = {
			username: userId.id,
			date: dateString
		}
		record
			.recordDays(data)
			.then(result => {
				setDaysCont(result.data)
			})
			.catch(err => {
				console.log(err)
			})
	}, [userId.id])

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
			<Text style={{ fontFamily: "line-rg", fontSize: 20, color: "#727272", marginTop: 10 }}>
				연속 운동 일자
			</Text>
			<Text style={styles.text}>{daysCont} 일</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "space-between",
		alignItems: "center",
		padding: 5,
		paddingBottom: 15,
		paddingTop: 10,
		backgroundColor: `#4278dd36`,
		borderRadius: 10,
		width: width / 2.5,
		height: height / 9,
		margin: 10
	},
	text: {
		fontSize: 24,
		color: "#373737",
		fontFamily: "line-bd",
		marginVertical: 5
	}
})

export default ExerciseDays
