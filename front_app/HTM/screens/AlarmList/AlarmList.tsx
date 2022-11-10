import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native"
import Constants from "expo-constants"
import { TextInput } from "react-native"
import { notice } from "../../api/noticeAPI"
import AlarmBox from "./alarmBox"
import React, { useState } from "react"
import { useAppSelector } from "../../store/hook"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

function AlarmList() {
	// const userId = useAppSelector(state => state.userId)
	const userId = "xofkdqkqh"
	let [alarmData, setAlarmData] = useState([])

	React.useEffect(() => {
		notice
			.getAlarms(userId)
			.then(result => {
				console.log(result.data)
				setAlarmData(result.data)
			})
			.catch(err => {
				console.log(err)
			})
	}, [])
	return (
		<View style={styles.container}>
			<View
				style={{
					width: width
				}}
			>
				<Text
					style={{
						fontSize: 30,
						paddingBottom: 5,
						paddingLeft: 20
					}}
				>
					알림
				</Text>
			</View>
			<ScrollView>
				{alarmData.length >= 1 ? (
					alarmData.map((cur, idx) => {
						return (
							<View key={idx} style={{ marginVertical: 7 }}>
								<AlarmBox alarmData={cur}></AlarmBox>
							</View>
						)
					})
				) : (
					<Text> 알람이 없습니다. </Text>
				)}
			</ScrollView>

		</View>
	)
}

export default AlarmList

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		alignItems: "center"
	}
})
