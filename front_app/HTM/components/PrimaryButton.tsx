import * as React from "react"
import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native"

function PrimaryButton({ children, clickFunction }: any) {
	function pressHandler() {
		console.log("눌렀다!")
	}

	return (
		<View style={styles.outerContainer}>
			<Pressable
				style={styles.innerContainer}
				onPress={clickFunction}
				android_ripple={{ color: "yellow" }}
			>
				<Text style={styles.textStyle}>{children}</Text>
			</Pressable>
		</View>
	)
}

function SelectButton({ children, clickFunction, color, borderColor }: any) {
	function pressHandler() {
		console.log("눌렀다!")
	}

	return (
		<View style={styles2(color, borderColor).outerContainer}>
			<Pressable
				style={styles2(color, borderColor).innerContainer}
				onPress={clickFunction}
				android_ripple={{ color: "yellow" }}
			>
				<Text style={styles2(color, borderColor).textStyle}>{children}</Text>
			</Pressable>
		</View>
	)
}

function SmallButton({ children, clickFunction, color, borderColor }: any) {
	function pressHandler() {
		console.log("눌렀다!")
	}

	return (
		<View style={styles3(color, borderColor).outerContainer}>
			<Pressable
				style={styles3(color, borderColor).innerContainer}
				onPress={clickFunction}
				android_ripple={{ color: "yellow" }}
			>
				<Text style={styles3(color, borderColor).textStyle}>{children}</Text>
			</Pressable>
		</View>
	)
}
function BigButton({ children, clickFunction, color, borderColor }: any) {
	return (
		<View style={styles4(color).outerContainer}>
			<Pressable style={styles4(color).innerContainer} onPress={clickFunction}>
				<Text style={styles4(color).textStyle}>{children}</Text>
			</Pressable>
		</View>
	)
}

function AlarmButton({ children, clickFunction, color }: any) {
	return (
		<View style={alarmStyle(color).outerContainer}>
			<Pressable
				style={alarmStyle(color).innerContainer}
				onPress={clickFunction}
				android_ripple={{ color: "yellow" }}
			>
				<Text style={alarmStyle(color).textStyle}>{children}</Text>
			</Pressable>
		</View>
	)
}

export { PrimaryButton, SelectButton, SmallButton, AlarmButton, BigButton }

const styles = StyleSheet.create({
	outerContainer: {
		borderRadius: 18,
		margin: 10,
		overflow: "hidden"
	},
	innerContainer: {
		padding: 16,
		backgroundColor: "#FAFAFA",
		elevation: 4
	},
	textStyle: {
		color: "#373737",
		fontSize: 20,
		textAlign: "center"
	}
})

const styles2 = (color: any, borderColor: any) =>
	StyleSheet.create({
		outerContainer: {
			borderRadius: 18,
			borderColor: borderColor,
			margin: 10,
			overflow: "hidden",
			borderStyle: "solid",
			borderWidth: 2
		},
		innerContainer: {
			paddingHorizontal: 30,
			paddingVertical: 4,
			backgroundColor: color
		},
		textStyle: {
			color: "black",
			fontSize: 20,
			textAlign: "center"
		}
	})

const styles3 = (color: any, borderColor: any) =>
	StyleSheet.create({
		outerContainer: {
			borderRadius: 18,
			borderColor: borderColor,
			margin: 10,
			overflow: "hidden",
			borderStyle: "solid",
			borderWidth: 2
		},
		innerContainer: {
			backgroundColor: color
		},
		textStyle: {
			color: "black",
			fontSize: 15,
			textAlign: "center"
		}
	})

const styles4 = (color: any) =>
	StyleSheet.create({
		outerContainer: {
			padding: 10,
			borderRadius: 7,
			margin: 10,
			backgroundColor: "lightgreen",
			width: (Dimensions.get("screen").width * 8) / 10
		},
		innerContainer: {
			flexDirection: "row",
			justifyContent: "center"
		},
		textStyle: {
			color: "white",
			fontSize: 20,
			textAlign: "center",
			fontFamily: "line-bd"
		}
	})
const alarmStyle = (color: any) =>
	StyleSheet.create({
		outerContainer: {
			borderRadius: 18,
			margin: 5,
			overflow: "hidden"
		},
		innerContainer: {
			paddingHorizontal: 10,
			paddingVertical: 4,
			backgroundColor: color
		},
		textStyle: {
			color: "black",
			fontSize: 15,
			textAlign: "center"
		}
	})
