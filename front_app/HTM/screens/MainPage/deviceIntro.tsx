import { StyleSheet, Text, View, Dimensions } from "react-native"
import { PrimaryButton } from "../../components/PrimaryButton"

let width = Dimensions.get("screen").width

function DeviceIntro() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>거울을 연결하여 사용하세요</Text>
			<View style={{width: width * 1/ 2}}>
				<PrimaryButton>거울 연결하기</PrimaryButton>
			</View>

		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		elevation: 4,
		padding: 20
	},
	text: {
		fontSize: 25,
		color: "#373737",
	}
})

export default DeviceIntro
