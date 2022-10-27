import { StyleSheet, Text, View } from "react-native"
import GoogleLogin from "./googleLogin"

function Header() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Hello</Text>
			<GoogleLogin></GoogleLogin>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		elevation: 4,
		padding: 20
	},
	text: {
		fontSize: 40
	}
})

export default Header
