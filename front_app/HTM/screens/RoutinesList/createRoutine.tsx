import { StyleSheet, Text, View } from "react-native"
import Constants from "expo-constants"

export default function CreateRoutine({ navigation }: any) {
	return (
		<View style={styles.container}>
			<Text>루틴 생성 페이지 입니다</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		marginTop: Constants.statusBarHeight
	}
})