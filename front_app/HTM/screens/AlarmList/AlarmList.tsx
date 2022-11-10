import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native"
import Constants from "expo-constants"
import { notice } from "../../api/noticeAPI"
import AlarmBox from "./alarmBox"
import React, { useState } from "react"

import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getAlarmList, initAlarmList } from "../../store/notice"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

function AlarmList() {
	const dispatch = useAppDispatch()

	const userId = useAppSelector(state => state.userId)
	const alarmList = useAppSelector(state => state.alarmList)

	React.useEffect(() => {
		notice
			.getAlarms(userId.id)
			.then(result => {
				dispatch(getAlarmList(result.data))
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
				{alarmList.length >= 1 ? (
					alarmList.map((cur, idx) => {
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
