import { StyleSheet, Text, View } from "react-native"
import Constants from "expo-constants"
import * as React from "react"

import { Feather } from "@expo/vector-icons"
import RoutineBox from "./routineBox"
import { routine } from "../../api/routineAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getRoutineList } from "../../store/routine"
import { SelectButton } from "../../components/PrimaryButton"

function RoutineList({ navigation }: any) {
	const dispatch = useAppDispatch()

	const userId = useAppSelector(state => state.userId)
	const routineList = useAppSelector(state => state.routineList)
	console.log("루틴목록", routineList)

	React.useEffect(() => {
		routine
			.routineList(userId.id)
			.then(result => {
				console.log(result.data)
				console.log(typeof result.data)
				dispatch(getRoutineList(result.data))
			})
			.catch(err => {
				console.log(err)
			})
	}, [])

	function moveToCreate() {
		navigation.navigate("CreateRoutine")
	}

	return (
		<View style={styles.container}>
			<Feather.Button
				style={styles.buttons}
				name="arrow-left"
				size={24}
				color="black"
				onPress={() => {
					navigation.goBack()
				}}
			/>
			{routineList.length >= 1 ? (
				<View style={{ justifyContent: "space-between" }}>
					<Text
						style={{
							flexDirection: "row",
							justifyContent: "flex-start",
							fontSize: 30
						}}
					>
						루틴
					</Text>
					<View style={{ alignItems: "center" }}>
						{routineList.map((cur, idx) => {
							return (
								<RoutineBox key={idx} routine={routineList[idx]}></RoutineBox>
							)
						})}
					</View>
				</View>
			) : (
				<Text>아직 루틴이 없군요</Text>
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
