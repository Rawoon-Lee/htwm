import { StyleSheet, Text, View, Dimensions } from "react-native"
import Constants from "expo-constants"
import { TextInput } from "react-native"
import { notice } from "../../api/noticeAPI"
import AlarmBox from "./alarmBox"
import React, { useState } from "react"
import { useAppSelector } from "../../store/hook"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

function AlarmList() {
	const userId = useAppSelector(state => state.userId)
	let [alarmData, setAlarmData] = useState([])

	React.useEffect(() => {
		notice.getAlarms(userId.id)
			.then(result => {
				console.log(result.data);
				setAlarmData(result.data)
			})
			.catch(err => {
				console.log(err);
			})
	}, [])
	return (
		<View style={styles.container}>
			<View style={{
				width: width,
			}}>
				<Text
					style={{
						fontSize: 30,
						paddingBottom: 5,
						paddingLeft: 20,
					}}
				>
					알림
				</Text>
			</View>
			{alarmData.length >= 1 ?
				alarmData.map((cur, idx) => {
					return (
						<AlarmBox key={idx} alarmData={alarmData}></AlarmBox>
					)
				}):
				<Text> 알람이 없습니다. </Text>
			}

		</View >
	)
}

export default AlarmList

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		alignItems: "center",
	}
})
