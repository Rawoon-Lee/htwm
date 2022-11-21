import { StyleSheet, Text, View, Pressable, Dimensions, Image } from "react-native"
import { AlarmButton } from "../../components/PrimaryButton"
import React from "react"

import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getAlarmList, initAlarmList } from "../../store/notice"
import { notice } from "../../api/noticeAPI"
import { user } from "../../api/userAPI"
import { streaming } from "../../api/streamingAPI"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

function AlarmBox(props: any) {
	let boxColor = ""
	if (props.alarmData.read == false) boxColor = `#D2D2FF`
	else boxColor = `#fff`

	return (
		<View style={boxStyle(boxColor).container}>
			<View
				style={{
					flexDirection: "row",
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
				dispatch(getAlarmList(result.data.reverse()))
			})
			.catch(err => {
				console.log(err)
			})
	}

	function readAlarm() {
		notice
			.readAlarm(props.alarmData.notice_id)
			.then(result => {
				updatAlarmList()
			})
			.catch(err => {
				console.log(err.response.data)
			})
	}

	function sendNotice(data: any) {
		readAlarm()
		let alarmData = {
			to: props.alarmData.fromPhoneId,
			title: "HTWM 알람",
			body: data,
			sound: "default"
		}

		fetch("https://exp.host/--/api/v2/push/send", {
			method: "POST", // *GET, POST, PUT, DELETE 등
			headers: {
				"Content-Type": "application/json"
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify(alarmData) // body의 데이터 유형은 반드시 "Content-Type" 헤더와 일치해야 함
		})
			.then(res => {
				console.log(JSON.stringify(res))
			})
			.catch(err => console.log(err))
	}
	const [fontsLoaded] = useFonts({
		"line-rg": require("../../assets/fonts/LINESeedKR-Rg.ttf"),
		"line-bd": require("../../assets/fonts/LINESeedKR-Bd.ttf")
	})

	React.useEffect(() => {
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
	}, [])

	const onLayoutRootView = React.useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync()
		}
	}, [fontsLoaded])

	if (!fontsLoaded) {
		return null
	}
	if (props.alarmData.type == "REQ_FRI") {
		return (
			<View
				style={{
					justifyContent: "space-between",
					alignItems: "center"
				}}
				onLayout={onLayoutRootView}
			>
				<View style={styles.message}>
					<Text style={{ flexWrap: "wrap", fontFamily: "line-rg", fontSize: 18 }}>
						{fromName}님이 친구신청 하였습니다.
					</Text>
				</View>
				{props.alarmData.read == false ? (
					<View style={{ flexDirection: "row", justifyContent: "center", marginTop: 5 }}>
						<AlarmButton
							children={"수락"}
							color={"skyblue"}
							clickFunction={() => {
								let data = {
									username: props.alarmData.toUsername,
									friendname: props.alarmData.fromUsername
								}
								user
									.friendAdd(data)
									.then(result => {
										sendNotice(props.alarmData.toUsername + "님이 친구가 되었습니다.")
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
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<View style={styles.message}>
					<Text style={{ flexWrap: "wrap", fontFamily: "line-rg", fontSize: 18 }}>
						{fromName}님이 플레이를 신청하였습니다.
					</Text>
				</View>
				{props.alarmData.read == false ? (
					<View style={{ flexDirection: "row", justifyContent: "center", marginTop: 5 }}>
						<AlarmButton
							children={"수락"}
							color={"skyblue"}
							clickFunction={() => {
								let data = {
									friendname: props.alarmData.fromUsername,
									username: props.alarmData.toUsername
								}

								streaming
									.acceptStreaming(data)
									.then(result => {
										sendNotice(props.alarmData.toUsername + "님이 플레이를 수락하셨습니다.")
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
								let data = {
									friendname: props.alarmData.toUsername,
									username: props.alarmData.fromUsername
								}
								streaming
									.denyStreaming(data)
									.then(result => {
										readAlarm()
										sendNotice(props.alarmData.toUsername + "님이 플레이를 거절하였습니다.")
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
				<Text style={{ flexWrap: "wrap", fontFamily: "line-rg", fontSize: 18 }}>
					{fromName}님이 친구가 되었습니다.
				</Text>
			</View>
		)
	} else if (props.alarmData.type == "ACC_STR") {
		return (
			<View style={styles.message} onTouchEnd={readAlarm}>
				<Text style={{ flexWrap: "wrap", fontFamily: "line-rg", fontSize: 18 }}>
					{fromName}님과 플레이가 시작되었습니다.
				</Text>
			</View>
		)
	} else if (props.alarmData.type == "DEN_STR") {
		return (
			<View style={styles.message} onTouchEnd={readAlarm}>
				<Text style={{ flexWrap: "wrap", fontFamily: "line-rg", fontSize: 18 }}>
					{fromName}님과의 플레이가 거절되었습니다.
				</Text>
			</View>
		)
	}
	return null
}

export default AlarmBox

const styles = StyleSheet.create({
	profile: {
		width: height / 17,
		height: height / 17,
		borderRadius: 30,
		marginRight: 10
	},
	message: {
		width: (width * 7) / 10,
		padding: 5
	}
})

const boxStyle = (color: any) =>
	StyleSheet.create({
		container: {
			backgroundColor: color,
			borderRadius: 15,
			width: (width * 9) / 10,
			justifyContent: "center",
			paddingHorizontal: 10,
			paddingVertical: 10,
			elevation: 4,
			marginHorizontal: 2
		}
	})
