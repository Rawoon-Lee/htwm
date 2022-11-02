import { StyleSheet, Text, View } from "react-native"
import { useAppSelector } from "../../store/hook"
import * as React from "react"

import { DateData } from "../MyRecord/MyRecord"

export default function DailyInfo(props: DateData) {
	const recordList = useAppSelector(state => state.recordList)

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
