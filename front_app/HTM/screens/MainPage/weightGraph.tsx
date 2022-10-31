import { StyleSheet, Text, View } from "react-native"

function WeightGraph() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>일주일간의 몸무게 변화</Text>
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

export default WeightGraph
