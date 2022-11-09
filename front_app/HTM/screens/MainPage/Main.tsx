import { StyleSheet, Text, View, Image, Pressable } from "react-native"
import { StatusBar } from "expo-status-bar"
import Constants from "expo-constants"
import * as React from "react"

import DeviceIntro from "./deviceIntro"
import ExerciseDays from "./exerciseDays"
import WeightGraph from "./weightGraph"
import WeightInput from "./weightInput"
import Header from "./header"

import TrainingBird from "./trainingBird"

function Main({ navigation }: any) {
	return (
		<View style={styles.container}>
			<Header navigation={navigation}></Header>
			<StatusBar style="auto" />
			<TrainingBird></TrainingBird>
			<View style={{ flexDirection: "row", marginTop: 10 }}>
				<ExerciseDays></ExerciseDays>
				<WeightInput></WeightInput>
			</View>
			<WeightGraph></WeightGraph>
			<View style={{ backgroundColor: "#D9D9D9", borderRadius: 20 }}>
				<DeviceIntro></DeviceIntro>
			</View>
		</View>
	)
}

export default Main

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		marginTop: Constants.statusBarHeight
	},
	text: {
		fontSize: 40
	},
	profilePic: {
		width: 20,
		height: 20,
		marginRight: 12
	}
})
