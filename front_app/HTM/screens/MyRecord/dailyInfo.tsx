import { StyleSheet, Text, View } from "react-native"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getUserRecord } from "../../store/record"
import * as React from "react"
import { record } from "../../api/record"

function MyRecord() {
	const userId = useAppSelector(state => state.userId)
	const recordList = useAppSelector(state => state.recordList)
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		record
			.recordList(userId.id)
			.then(result => {
				console.log("레코드 결과", result.data)
				dispatch(getUserRecord(result.data))
			})
			.catch(err => console.log(err))
	})

	return (
		<View>
			<Text>기록</Text>
			<Text>{recordList[0].routineInfo}</Text>
		</View>
	)
}

export default MyRecord
