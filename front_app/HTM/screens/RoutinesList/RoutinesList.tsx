import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import { TextInput } from "react-native"
import { routine } from "../../api/routine"
import * as React from "react"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

function RoutineList() {
	const [routineList, setRoutineList] = React.useState()
	const navigation = useNavigation()
	// React.useEffect({}, [])

	return (
		<View>
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
			<Feather.Button
				name="plus-circle"
				size={24}
				color="black"
				onPress={() => navigation.navigate("CreateRoutine")}
			/>
			<StatusBar style="auto" />
		</View>
	)
}

export default RoutineList

const styles = StyleSheet.create({
	buttons: {
		backgroundColor: "white"
	}
})
