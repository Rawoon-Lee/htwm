import { StyleSheet, Text, View } from "react-native"
import { TextInput } from "react-native"
import PrimaryButton from "../../components/PrimaryButton"

function Main() {
	return (
		<View style={styles.container}>
			<Text>여기는 메인화면 입니다</Text>
			<PrimaryButton>Google 로그인</PrimaryButton>
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
