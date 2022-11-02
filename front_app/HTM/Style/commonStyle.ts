import { StyleSheet } from "react-native"
import Constants from "expo-constants"

export const commonStyle = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "yellow",
		alignItems: "center",
		justifyContent: "center",
		marginTop: Constants.statusBarHeight
	}
})
