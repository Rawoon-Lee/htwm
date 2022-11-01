import { StyleSheet, Text, View } from "react-native"
import Constants from "expo-constants"
import * as React from "react"
import { useNavigation } from "@react-navigation/native"
import { TextInput } from "react-native"

import { Feather } from "@expo/vector-icons"
import RoutineBox from "./routineBox"
import { routine } from "../../api/routineAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import Routine, { getRoutineList } from "../../store/routine"
import { SelectButton } from "../../components/PrimaryButton"

function RoutineList() {
	const navigation = useNavigation()
	const dispatch = useAppDispatch()

	const userId = useAppSelector(state => state.userId)
	const routineList = useAppSelector(state => state.routineList)

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
					clickFunction={() => {
						console.log("클릭함")
					}}
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
