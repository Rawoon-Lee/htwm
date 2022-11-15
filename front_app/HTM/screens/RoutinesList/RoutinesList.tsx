import { StyleSheet, Text, View } from "react-native"
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
import { commonStyle } from "../../Style/commonStyle"

function RoutineList({ navigation }: any) {
	const dispatch = useAppDispatch()

	const userId = useAppSelector(state => state.userId)
	const routineList = useAppSelector(state => state.routineList)
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
			<Text
				style={{
					fontSize: 30,
					paddingBottom: 5,
					paddingLeft: 20
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
				<Text style={{ fontFamily: "line-rg", fontSize: 20, textAlign: "center" }}>
					아직 루틴이 없군요
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
					children={"추가"}
					color={"white"}
					borderColor={"green"}
					clickFunction={moveToCreate}
				/>
			</View>
		</View>
	)
}

export default RoutineList

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight
	},
	buttons: {
		backgroundColor: "white"
	}
})
