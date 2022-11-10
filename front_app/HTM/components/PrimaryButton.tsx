import * as React from "react"
import { StyleSheet, Text, View, Pressable } from "react-native"

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

function AlarmButton({children, clickFunction, color} : any){
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

export { PrimaryButton, SelectButton, SmallButton, AlarmButton }

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

const alarmStyle = (color: any) =>
	StyleSheet.create({
		outerContainer: {
			borderRadius: 18,
			margin: 5,
			overflow: "hidden",
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
