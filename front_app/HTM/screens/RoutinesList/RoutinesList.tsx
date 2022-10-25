import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import { TextInput } from "react-native"
import { routine } from "../../api/routine"
import * as React from "react"

function RoutineList() {
	const [routineList, setRoutineList] = React.useState()
	// React.useEffect({}, [])

	return (
		<View>
			<Text>루틴 리스트</Text>
			<StatusBar style="auto" />
		</View>
	)
}

export default RoutineList
