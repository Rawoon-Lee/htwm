import { StyleSheet } from "react-native"
import Constants from "expo-constants"

export const commonStyle = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		marginTop: Constants.statusBarHeight
	}
})
