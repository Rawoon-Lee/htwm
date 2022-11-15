import { StyleSheet, Text, View, Pressable, Dimensions, Image } from "react-native"
import { AlarmButton } from "../../components/PrimaryButton"
import React from "react"

import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getAlarmList, initAlarmList } from "../../store/notice"
import { notice } from "../../api/noticeAPI"
import { user } from "../../api/userAPI"
import { streaming } from "../../api/streamingAPI"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

function AlarmBox(props: any) {
	let boxColor = ""
	if (props.alarmData.read == false) boxColor = `rgba(0, 121, 107, 0.2)`
	else boxColor = `rgba(203, 203, 203, 1)`

	return (
		<View style={boxStyle(boxColor).container}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<Image style={styles.profile} source={{ uri: props.alarmData.fromUrl }}></Image>

				<AlarmMessage alarmData={props.alarmData}></AlarmMessage>
			</View>
		</View>
	)
}

function AlarmMessage(props: any) {
	const dispatch = useAppDispatch()

	const userId = useAppSelector(state => state.userId)
	const alarmList = useAppSelector(state => state.alarmList)

	let fromName = props.alarmData.fromNickname

	function updatAlarmList() {
		notice
			.getAlarms(userId.id)
			.then(result => {
				dispatch(getAlarmList(result.data))
			})
			.catch(err => {
				console.log(err)
			})
	}

	function readAlarm() {
		notice
			.readAlarm(props.alarmData.notice_id)
			.then(result => {
				console.log(result)
				updatAlarmList()
			})
			.catch(err => {
				console.log(err.response.data)
			})
	}

	function sendNotice(data:any) {
		readAlarm()
		let alarmData = {
			to: props.alarmData.fromPhoneId,
			title: data,
			body: data,
			sound: "default"
		}

		fetch("https://exp.host/--/api/v2/push/send", {
			method: "POST", // *GET, POST, PUT, DELETE 등
			headers: {
			  "Content-Type": "application/json",
			  // 'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify(alarmData), // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
		  }).then((res) => {
			console.log(JSON.stringify(res))
		  })
	}

	if (props.alarmData.type == "REQ_FRI") {
		return (
			<View
				style={{
					flexDirection: "row",
					width: width / 2,
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<View style={styles.message}>
					<Text style={{ fontSize: 14 }}>
						{fromName}님이{"\n"}친구신청 하였습니다.
					</Text>
				</View>
				{props.alarmData.read == false ? (
					<View style={{ flexDirection: "row", marginLeft: -30, justifyContent: "center" }}>
						<AlarmButton
							children={"수락"}
							color={"skyblue"}
							clickFunction={() => {
								let data = {
									username: props.alarmData.toUsername,
									friendname: props.alarmData.fromUsername
								}
								console.log(data)

								user
									.friendAdd(data)
									.then(result => {
										console.log(result)
										sendNotice(props.toUsername + "님이 친구가 되었습니다.")

									})
									.catch(err => {
										console.log(err.response.data)
										readAlarm()
										if (err.response.data == "이미 친구입니다.") alert("이미 친구입니다!!")
									})
							}}
						/>
						<AlarmButton children={"거절"} color={"pink"} clickFunction={readAlarm} />
					</View>
				) : null}
			</View>
		)
	} else if (props.alarmData.type == "REQ_STR") {
		return (
			<View
				style={{
					flexDirection: "row",
					width: width / 2,
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<View style={styles.message}>
					<Text style={{ fontSize: 14 }}>
						{fromName}님이{"\n"}플레이를 신청하였습니다.
					</Text>
				</View>
				{props.alarmData.read == false ? (
					<View style={{ flexDirection: "row", marginLeft: -30, justifyContent: "center" }}>
						<AlarmButton
							children={"수락"}
							color={"skyblue"}
							clickFunction={() => {
								let data = { from: props.alarmData.fromUsername, to: props.alarmData.toUsername }
								streaming
									.acceptStreaming(data)
									.then(result => {
										console.log(result)
										readAlarm()
										sendNotice(props.toUsername + "님이 플레이를 수락하셨습니다.")
									})
									.catch(err => {
										console.log(err.response.data)
									})
							}}
						/>
						<AlarmButton
							children={"거절"}
							color={"pink"}
							clickFunction={() => {
								let data = { from: props.alarmData.fromUsername, to: props.alarmData.toUsername }
								streaming
									.denyStreaming(data)
									.then(result => {
										console.log(result)
										readAlarm()
										sendNotice(props.toUsername + "님이 플레이를 거절하였습니다.")
									})
									.catch(err => {
										console.log(err.response.data)
									})
							}}
						/>
					</View>
				) : null}
			</View>
		)
	} else if (props.alarmData.type == "ACC_FRI") {
		return (
			<View style={styles.message} onTouchEnd={readAlarm}>
				<Text style={{ fontSize: 14, marginLeft: -100 }}>
					{fromName}님이{"\n"}친구가 되었습니다.
				</Text>
			</View>
		)
	} else if (props.alarmData.type == "ACC_STR") {
		return (
			<View style={styles.message} onTouchEnd={readAlarm}>
				<Text style={{ fontSize: 14, marginLeft: -100 }}>
					{fromName}님이{"\n"}플레이를 수락하였습니다.
				</Text>
			</View>
		)
	} else if (props.alarmData.type == "DEN_STR") {
		return (
			<View style={styles.message} onTouchEnd={readAlarm}>
				<Text style={{ fontSize: 14, marginLeft: -100 }}>
					{fromName}님이{"\n"}플레이를 거절하였습니다.
				</Text>
			</View>
		)
	}
	return null
}

export default AlarmBox

const styles = StyleSheet.create({
	profile: {
		width: height / 15,
		height: height / 15
	},
	message: {
		width: (width * 5) / 12,
		marginLeft: -70
	}
})

const boxStyle = (color: any) =>
	StyleSheet.create({
		container: {
			backgroundColor: color,
			borderRadius: 10,
			width: (width * 9) / 10,
			height: height / 11,
			justifyContent: "center",
			paddingHorizontal: 10
		}
	})
