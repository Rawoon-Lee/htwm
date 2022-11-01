import { StyleSheet, Text, View } from "react-native"
import Constants from "expo-constants"
import { TextInput } from "react-native"

function FriendsList() {
	return (
		<View style={styles.container}>
			<Text>친구목록</Text>
		</View>
	)
}

export default FriendsList

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight
	}
})
