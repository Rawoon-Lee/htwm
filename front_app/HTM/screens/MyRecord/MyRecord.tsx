import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import { TextInput } from "react-native"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getUserRecord } from "../../store/record"
import * as React from "react"
import { record } from "../../api/record"

function MyRecord() {
	const userInfo = useAppSelector(state => state.recordList)
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		// record.recordList()
	})

	return (
		<View>
			<Text>기록</Text>
			<StatusBar style="auto" />
		</View>
	)
}

export default MyRecord
