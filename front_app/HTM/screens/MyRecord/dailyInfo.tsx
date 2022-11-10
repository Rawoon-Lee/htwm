import { StyleSheet, Text, View, Image } from "react-native"
import * as React from "react"

import moment from "moment"

import { useAppSelector, useAppDispatch } from "../../store/hook"
import { picture } from "../../api/pictureAPI"
import { getPicList } from "../../store/picture"

import { RecordData } from "../../store/record"
import { DateData } from "../MyRecord/MyRecord"

export default function DailyInfo(props: DateData) {
	const dispatch = useAppDispatch()

	const userId = useAppSelector(state => state.userId)
	const recordList = useAppSelector(state => state.recordList)
	const picList = useAppSelector(state => state.picList)

	let dailyRecord = recordList.filter(
		(item: RecordData) => item.startDateTime.slice(0, 10) == props.dateString
	)

	React.useEffect(() => {
		dailyRecord = recordList.filter(
			(item: RecordData) => item.startDateTime.slice(0, 10) == props.dateString
		)
		let data = { username: userId.id, date: props.dateString }
		picture
			.pictureList(data)
			.then(result => {
				console.log("사진가져왔음")
				console.log(result.data)
				dispatch(getPicList(result.data))
			})
			.catch(err => {
				console.log("오늘의 사진 못가져옴")
				console.log(err)
			})
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
	// console.log(recordList[0].routineJson)ㄴ
	return (
		<View>
			{dailyRecord.length >= 1 || picList.length >= 1 ? (
				<View>
					{dailyRecord.length >= 1 &&
						dailyRecord.map((item, idx) => {
							return (
								<View key={idx}>
									<Text>
										{msToTime(Date.parse(item.endDateTime) - Date.parse(item.startDateTime))}
									</Text>
									<Text>{item.doneSetNum}</Text>
									{/* <Text>{item.routineJson}</Text> */}
									<Text key={idx}>{item.username}</Text>
								</View>
							)
						})}
					{picList.length >= 1 &&
						picList.map((item, idx) => {
							return (
								<View key={idx}>
									<Image source={{ uri: item.url }} style={{ width: 100, height: 100 }} />
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
