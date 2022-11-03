import { StyleSheet, Text, View } from "react-native"
import { useAppSelector } from "../../store/hook"
import * as React from "react"
import moment from "moment"

import { DateData } from "../MyRecord/MyRecord"
import { RecordData } from "../../store/record"

export default function DailyInfo(props: DateData) {
	const recordList = useAppSelector(state => state.recordList)
	let dailyRecord = recordList.filter(
		(item: RecordData) => item.startDateTime.slice(0, 10) == props.dateString
	)

	React.useEffect(() => {
		dailyRecord = recordList.filter(
			(item: RecordData) => item.startDateTime.slice(0, 10) == props.dateString
		)
	}, [props.timestamp])

	function msToTime(diff: number) {
		let duration = moment.duration(diff)
		let seconds: number = duration.asSeconds()
		let minute: number = duration.asMinutes()
		let hours: number = duration.asHours()

		// 그래서 사용할 때는 parseInt 를 사용해 int 로 바꿔야 한다.
		if (minute < 1) {
			// 1분 미만이면 초 단위로 보여주고,
			return seconds.toString() + "초"
		} else if (hours < 1) {
			// 1시간 미만이면 분 단위로 보여주고
			return minute.toString() + "분"
		} else {
			// 하루 미만이면 시간으로 보여주고
			return hours.toString() + "시간 " + (minute % 60).toString() + "분"
		}
	}
	console.log(recordList[0].routineJson)
	return (
		<View>
			{dailyRecord.length >= 1 ? (
				<View>
					{dailyRecord.map((item, idx) => {
						return (
							<View key={idx}>
								<Text>
									{msToTime(
										Date.parse(item.endDateTime) -
											Date.parse(item.startDateTime)
									)}
								</Text>
								<Text>{item.doneSetNum}</Text>
								{/* <Text>{item.routineJson}</Text> */}
								<Text key={idx}>{item.username}</Text>
							</View>
						)
					})}
				</View>
			) : (
				<Text>아직 운동기록이 없군요</Text>
			)}
		</View>
	)
}
