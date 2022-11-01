import { StyleSheet, Text, View } from "react-native"
import Constants from "expo-constants"
import * as React from "react"
import { useNavigation } from "@react-navigation/native"
import { TextInput } from "react-native"

import { Feather } from "@expo/vector-icons"

import { routine } from "../../api/routine"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getRoutineList } from "../../store/routine"

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
				if (result.data) dispatch(getRoutineList(result.data))
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
			<Text>루틴 리스트</Text>
			<Text>{routineList[0].color}</Text>
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
