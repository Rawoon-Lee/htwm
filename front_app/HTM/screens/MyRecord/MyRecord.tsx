import { StyleSheet, Text, View } from "react-native"
import Constants from "expo-constants"
import { TextInput } from "react-native"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getUserRecord } from "../../store/record"
import * as React from "react"
import { record } from "../../api/record"
import DailyInfo from "./dailyInfo"

function MyRecord() {
	const userInfo = useAppSelector(state => state.recordList)
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		// record.recordList()
	})

	return (
		<View style={styles.container}>
			<Text>기록</Text>
			<DailyInfo></DailyInfo>
		</View>
	)
}

export default MyRecord

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight
	}
})
