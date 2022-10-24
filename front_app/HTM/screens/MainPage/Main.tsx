import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import { TextInput } from "react-native"

function Main() {
	return (
		<View style={styles.container}>
			<Text>여기는 메인화면 입니다</Text>
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
