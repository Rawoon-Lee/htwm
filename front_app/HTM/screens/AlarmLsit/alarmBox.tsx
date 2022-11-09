import { StyleSheet, Text, View, Pressable, Dimensions, Image } from "react-native"
import { AlarmButton } from "../../components/PrimaryButton"
import React from "react"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

function AlarmBox(props: any) {
	console.log("==================================================================", props.alarmData)
	return (
		<View style={boxStyle(`rgba(0, 121, 107, 0.2)`).container}>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center"
				}}
			>
				<Image style={styles.profile} source={require("./../../assets/htwm_logo.png")}></Image>

				<AlarmMessage
					fromName={props.alarmData.fromNickname}
					type={props.alarmData[0].type}
				></AlarmMessage>
				<View style={{}}>
					<AlarmButton
						children={"수락"}
						color={"skyblue"}
						clickFunction={() => {
							console.log("눌러따")
						}}
					/>
				</View>
			</View>
		</View>
	)
}

function AlarmMessage(props: any) {
	let fromName = props.fromName
	if (props.type == "REQ_FRI") {
		return (
			<View style={styles.message}>
				<Text style={{ fontSize: 14 }}>
					{fromName}님이{"\n"}친구신청 하였습니다.
				</Text>
			</View>
		)
	} else if (props.type == "REQ_STR") {
		return (
			<View style={styles.message}>
				<Text style={{ fontSize: 14 }}>
					{fromName}님이{"\n"}플레이를 신청했습니다.
				</Text>
			</View>
		)
	} else if (props.type == "ACC_FRI") {
		return (
			<View style={styles.message}>
				<Text style={{ fontSize: 14 }}>
					{fromName}님이{"\n"}친구가 되었습니다.
				</Text>
			</View>
		)
	} else if (props.type == "ACC_STR") {
		return (
			<View style={styles.message}>
				<Text style={{ fontSize: 14 }}>
					{fromName}님이{"\n"}플레이를 받아들였습니다.
				</Text>
			</View>
		)
	} else if (props.type == "DEN_STR") {
		return (
			<View style={styles.message}>
				<Text style={{ fontSize: 14 }}>
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
		width: height / 13,
		height: height / 13
	},
	message: {
		width: width / 3,
		marginLeft: -60
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
