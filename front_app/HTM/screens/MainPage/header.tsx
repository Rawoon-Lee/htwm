import { StyleSheet, Text, View } from "react-native"
import GoogleLogin from "./googleLogin"
import { useNavigation } from "@react-navigation/native"

function Header() {
	const navigation = useNavigation()

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
