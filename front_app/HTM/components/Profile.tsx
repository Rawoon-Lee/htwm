import { StyleSheet, Text, View, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"

function Header() {
	const navigation = useNavigation()

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Sabina</Text>
			<Image source={require("../assets/profileImg.jpg")} />
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
