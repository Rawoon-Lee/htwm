import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native"
import { SelectButton } from "../../components/PrimaryButton"
import * as React from "react"

import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getRoutineList, initRoutineList } from "../../store/routine"
import { routine } from "../../api/routineAPI"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { color } from "../../Style/commonStyle"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

const Color = require("color")

function RoutineBox(props: any) {
	const dispatch = useAppDispatch()
	const userId = useAppSelector(state => state.userId)

	const [fontsLoaded] = useFonts({
		"line-rg": require("../../assets/fonts/LINESeedKR-Rg.ttf"),
		"line-bd": require("../../assets/fonts/LINESeedKR-Bd.ttf")
	})

	React.useEffect(() => {
		// 폰트 불러오기
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
	}, [])

	let sec = 0
	for (let i = 0; i < props.routine.sets.length; i++) {
		sec += parseInt(props.routine.sets[i].sec)
	}
	let min = parseInt(String(sec / 60))
	sec = sec % 60

	const onLayoutRootView = React.useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync()
		}
	}, [fontsLoaded])

	if (!fontsLoaded) {
		return null
	}

	function updateReduxRoutineList() {
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
	}

	return (
		<View style={boxStyle(props.routine.color).container} onLayout={onLayoutRootView}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					marginHorizontal: 25,
					marginVertical: 10
				}}
			>
				<Text
					numberOfLines={1}
					style={{ fontSize: 25, width: 200, fontFamily: "line-bd", overflow: "hidden" }}
				>
					{props.routine.name}
				</Text>
				<Text style={{ fontSize: 15, fontFamily: "line-rg" }}>
					{min === 0 ? null : `${min} 분 `}
					{sec} 초
				</Text>
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					marginHorizontal: 20
				}}
			>
				<View style={{ flexWrap: "wrap", flexDirection: "row", width: 210, marginVertical: 5 }}>
					{props.routine.sets.map((cur: any, idx: number) => {
						if (cur.exercise_name == "휴식") return
						return (
							<View
								key={idx}
								style={{
									backgroundColor: Color(props.routine.color).lighten(0.5).hex(),
									borderRadius: 5,
									padding: 4,
									margin: 2
								}}
							>
								<Text
									style={{
										fontFamily: "line-rg",
										fontSize: 12
									}}
								>
									{cur.exercise_name}
								</Text>
							</View>
						)
					})}
				</View>
				<View style={{ marginRight: -20 }}>
					<SelectButton
						children={"제거"}
						color={"white"}
						borderColor={color.danger}
						textColor={color.danger}
						clickFunction={() => {
							let body = {
								username: props.routine.username,
								name: props.routine.name
							}
							routine
								.routineDelete(body)
								.then(result => {
									alert("삭제 되었습니다")
									updateReduxRoutineList()
								})
								.catch(err => {
									alert(err.response.data)
								})
						}}
					/>
				</View>
			</View>
		</View>
	)
}

export default RoutineBox

const styles = StyleSheet.create({
	container: {}
})

const boxStyle = (color: any) =>
	StyleSheet.create({
		container: {
			backgroundColor: Color(color).lighten(0.25).hex(),
			// opacity: 0.8,
			borderRadius: 10,
			width: (width * 9) / 10,
			// height: height / 8.5,
			justifyContent: "space-between",
			margin: 5
			// elevation: 3
		}
	})
