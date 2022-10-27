import { StyleSheet, Text, View } from "react-native"
import GoogleLogin from "./googleLogin"
import DeviceIntro from "./deviceIntro"

function Main() {
	return (
		<View style={styles.container}>
			<GoogleLogin></GoogleLogin>
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
