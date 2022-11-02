import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import Constants from "expo-constants"
import GoogleLogin from "./googleLogin"
import DeviceIntro from "./deviceIntro"
import ExerciseDays from "./exerciseDays"
import Header from "./header"
import WeightGraph from "./weightGraph"
import WeightInput from "./weightInput"
import TrainingBird from "./trainingBird"

function Main() {
	return (
		<View style={styles.container}>
			<StatusBar style="auto" />
			<Header></Header>
			<TrainingBird></TrainingBird>
			<View style={{flexDirection: "row", marginTop: 10}}>
				<ExerciseDays></ExerciseDays>
				<WeightInput></WeightInput>
			</View>
			<WeightGraph></WeightGraph>
			<View style={{backgroundColor: "#D9D9D9", borderRadius:20}}>
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
	}
})
