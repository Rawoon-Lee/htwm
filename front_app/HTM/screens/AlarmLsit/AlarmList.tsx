import { StyleSheet, Text, View } from "react-native"
import Constants from "expo-constants"
import { TextInput } from "react-native"

function AlarmList() {
	return (
		<View style={styles.container}>
			<Text>AlarmList</Text>
		</View>
	)
}

export default AlarmList

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight
	}
})
