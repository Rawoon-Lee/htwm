import * as React from "react"
import { StyleSheet, Text, View, Pressable } from "react-native"

function PrimaryButton({ children }: any) {
	function pressHandler() {
		console.log("눌렀다!")
	}

	return (
		<View style={styles.outerContainer}>
			<Pressable
				style={styles.innerContainer}
				onPress={pressHandler}
				android_ripple={{ color: "yellow" }}
			>
				<Text style={styles.textStyle}>{children}</Text>
			</Pressable>
		</View>
	)
}

export default PrimaryButton

const styles = StyleSheet.create({
	outerContainer: {
		borderRadius: 18,
		margin: 10,
		overflow: "hidden"
	},
	innerContainer: {
		padding: 16,
		backgroundColor: "grey",
		elevation: 4
	},
	textStyle: {
		color: "white",
		fontSize: 20,
		textAlign: "center"
	}
})
