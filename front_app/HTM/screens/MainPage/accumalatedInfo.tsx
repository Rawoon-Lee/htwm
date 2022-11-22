import { StyleSheet, Text, View, Dimensions } from "react-native"
import * as React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { record } from "../../api/recordAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getUserRecord } from "../../store/record"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width
function AccumulatedInfo() {
	const dispatch = useAppDispatch()

	const userId = useAppSelector(state => state.userId)
	const recordList = useAppSelector(state => state.recordList)
	const [exercise, setExercise] = React.useState<string[]>([])
	const [routine, setRoutine] = React.useState("0")

	const [fontsLoaded] = useFonts({
		"line-rg": require("../../assets/fonts/LINESeedKR-Rg.ttf"),
		"line-bd": require("../../assets/fonts/LINESeedKR-Bd.ttf")
	})

	async function storeRoutineCnt() {
		try {
			const routineCnt = recordList.length
			await AsyncStorage.setItem("rouineCnt", String(routineCnt))
		} catch (err) {
			console.log(err)
		}
	}
	async function retreiveRoutineCnt() {
		try {
			const loadedData = await AsyncStorage.getItem("rouineCnt")
			if (loadedData) {
				setRoutine(loadedData)
			}
		} catch (err) {
			console.log(err)
		}
	}
	React.useEffect(() => {
		// countUniqueDays()
		if (recordList.length > 0) storeRoutineCnt()
		retreiveRoutineCnt()
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
		record
			.recordList(userId.id)
			.then(result => {
				// setExercise(result.data)
				setRoutine(result.data.length)
				dispatch(getUserRecord(result.data))
			})
			.catch(err => {
				console.log(err)
			})
	}, [])

	React.useEffect(() => {
		if (recordList.length > 0) storeRoutineCnt()
		retreiveRoutineCnt()
	}, [recordList])

	function countUniqueDays() {
		let temp: string[] = []

		for (let i = 0; i < recordList.length; i++) {
			if (!temp.includes(recordList[i].startDateTime.slice(0, 10))) {
				temp.push(recordList[i].startDateTime.slice(0, 10))
			}
		}
		setExercise(temp)
	}

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
				누적 루틴 수행
			</Text>
			<Text style={styles.text}>{routine} 회</Text>
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
		backgroundColor: `#3b7aee3b`,
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

export default AccumulatedInfo
