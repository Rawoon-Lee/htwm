import { StyleSheet, Text, View } from "react-native"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getUserRecord } from "../../store/record"
import * as React from "react"

import { DateData } from "../MyRecord/MyRecord"

import { record } from "../../api/recordAPI"

export default function DailyInfo({ year, month, date }: DateData) {
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
	}, [year, month, date])

	return (
		<View>
			{recordList.length >= 1 ? (
				<Text>{recordList[0].doneSetNum}</Text>
			) : (
				<Text>아직 운동기록이 없군요</Text>
			)}
		</View>
	)
}
