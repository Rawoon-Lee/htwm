import { StyleSheet, Text, View } from "react-native"
import Constants from "expo-constants"
import { TextInput } from "react-native"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getUserRecord } from "../../store/record"
import * as React from "react"
import { record } from "../../api/recordAPI"
import DailyInfo from "./dailyInfo"

export interface DateData {
	year: number
	month: number
	date: number
}

function MyRecord() {
	const recordList = useAppSelector(state => state.recordList)
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		// record.recordList()
	})

	function selectDay() {}
	return (
		<View style={styles.container}>
			<Text>기록</Text>
			<DailyInfo year={0} month={0} date={0}></DailyInfo>
		</View>
	)
}

export default MyRecord

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight
	}
})
