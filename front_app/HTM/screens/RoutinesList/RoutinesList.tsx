import { StyleSheet, Text, View, ScrollView, Dimensions, RefreshControl } from "react-native"
import Constants from "expo-constants"
import * as React from "react"

import { Feather } from "@expo/vector-icons"
import RoutineBox from "./routineBox"
import { routine } from "../../api/routineAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getRoutineList, initRoutineList } from "../../store/routine"
import { SelectButton } from "../../components/PrimaryButton"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { color } from "../../Style/commonStyle"

let width = Dimensions.get("screen").width

const wait = (timeout: number) => {
	return new Promise(resolve => setTimeout(resolve, timeout))
}

function RoutineList({ navigation }: any) {
	const dispatch = useAppDispatch()

	const userId = useAppSelector(state => state.userId)
	const routineList = useAppSelector(state => state.routineList)
	const [refreshing, setRefreshing] = React.useState(false)

	const onRefresh = React.useCallback(() => {
		setRefreshing(true)
		wait(1000).then(() => setRefreshing(false))
	}, [])

	const [fontsLoaded] = useFonts({
		"line-rg": require("../../assets/fonts/LINESeedKR-Rg.ttf")
	})
	React.useEffect(() => {
		// 폰트 불러오기
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
		if (!userId.id) {
			dispatch(initRoutineList())
			return
		}
		routine
			.routineList(userId.id)
			.then(result => {
				dispatch(getRoutineList(result.data))
			})
			.catch(err => {
				console.log(err)
			})
	}, [])

	function moveToCreate() {
		navigation.navigate("CreateRoutine")
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
		<View style={styles.container} onLayout={onLayoutRootView}>
			<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
				<Text
					style={{
						fontSize: 30,
						paddingVertical: 10,
						paddingLeft: 20,
						fontFamily: "line-bd"
					}}
				>
					루틴
				</Text>
				{routineList.length >= 1 ? (
					<View style={{ justifyContent: "space-between" }}>
						<View style={{ alignItems: "center" }}>
							{routineList.map((cur, idx) => {
								return <RoutineBox key={idx} routine={routineList[idx]}></RoutineBox>
							})}
						</View>
					</View>
				) : (
					<Text style={{ fontFamily: "line-rg", fontSize: 25, textAlign: "center" }}>
						😥 아직 루틴이 없군요
					</Text>
				)}

				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						marginTop: 10
					}}
				>
					<SelectButton
						children={<Feather name="plus-circle" size={24} color="white" />}
						color={"lightgreen"}
						clickFunction={moveToCreate}
						borderColor={"lightgreen"}
						textColor={"white"}
						width={(width * 9) / 10}
					/>
				</View>
			</ScrollView>
		</View>
	)
}

export default RoutineList

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		backgroundColor: "white",
		flex: 1
	},
	buttons: {
		backgroundColor: "white"
	}
})
