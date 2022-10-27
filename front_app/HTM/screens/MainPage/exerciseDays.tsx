import { StyleSheet, Text, View } from "react-native"
import PrimaryButton from "../../components/PrimaryButton"

function ExerciseDays() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>거울을 연결하여 사용하세요</Text>
			<PrimaryButton>거울 연결하기</PrimaryButton>
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
		fontSize: 25
	}
})

export default ExerciseDays
