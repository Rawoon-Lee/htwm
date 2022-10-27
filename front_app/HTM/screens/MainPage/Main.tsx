import { StyleSheet, Text, View } from "react-native"
import GoogleLogin from "./googleLogin"
import DeviceIntro from "./deviceIntro"
import ExerciseDays from "./exerciseDays"
import Header from "./header"
import WeightGraph from "./weightGraph"
import WeightInput from "./weightInput"

function Main() {
	return (
		<View style={styles.container}>
			<Header></Header>
			<ExerciseDays></ExerciseDays>
			<WeightInput></WeightInput>
			<WeightGraph></WeightGraph>
			<DeviceIntro></DeviceIntro>
		</View>
	)
}

export default Main

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center"
	}
})
