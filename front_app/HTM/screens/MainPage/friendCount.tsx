import { StyleSheet, Text, View, Dimensions } from "react-native"
import * as React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { user } from "../../api/userAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getFriendsList } from "../../store/user"
import { useIsFocused } from "@react-navigation/native"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width
function FriendCount() {
	const dispatch = useAppDispatch()
	const isFocused = useIsFocused()

	const userId = useAppSelector(state => state.userId)
	const friendList = useAppSelector(state => state.friendList)
	const [exercise, setExercise] = React.useState<string[]>([])
	const [routine, setRoutine] = React.useState("0")

	const [fontsLoaded] = useFonts({
		"line-rg": require("../../assets/fonts/LINESeedKR-Rg.ttf"),
		"line-bd": require("../../assets/fonts/LINESeedKR-Bd.ttf")
	})
	async function storeRoutineCnt() {
		try {
			const routineCnt = friendList.length
			await AsyncStorage.setItem("friendCnt", String(routineCnt))
		} catch (err) {
			console.log(err)
		}
	}
	async function retreiveRoutineCnt() {
		try {
			const loadedData = await AsyncStorage.getItem("friendCnt")
			if (loadedData) {
				setRoutine(loadedData)
			}
		} catch (err) {
			console.log(err)
		}
	}
	React.useEffect(() => {
		if (friendList.length > 0) storeRoutineCnt()
		retreiveRoutineCnt()
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
		user
			.friendList(userId.id)
			.then(result => {
				dispatch(getFriendsList(result.data))
			})
			.catch(err => console.log(err))
	}, [])

	React.useEffect(() => {
		if (friendList.length > 0) storeRoutineCnt()
		retreiveRoutineCnt()
	}, [friendList])

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
				친구 숫자
			</Text>
			<Text style={styles.text}>{routine} 명</Text>
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
		backgroundColor: `#547ecc33`,
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

export default FriendCount
