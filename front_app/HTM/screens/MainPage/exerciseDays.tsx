import { StyleSheet, Text, View } from "react-native"
import PrimaryButton from "../../components/PrimaryButton"
function ExerciseDays() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>31연속</Text>
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
