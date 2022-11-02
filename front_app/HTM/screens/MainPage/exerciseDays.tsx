import { buildCodeAsync } from "expo-auth-session/build/PKCE"
import { StyleSheet, Text, View, Dimensions } from "react-native"
import {PrimaryButton} from "../../components/PrimaryButton"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width
function ExerciseDays() {
	return (
		<View style={styles.container}>
			<Text style={{fontSize:12, color:"#727272"}}>연속 운동 일자</Text>
			<Text style={styles.text}>31연속</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "space-between",
		alignItems: "center",
		padding: 5,
		paddingBottom: 15,
		paddingTop: 10,
		backgroundColor: `rgba(0,190,164,0.2)`,
		borderRadius: 10,
		width: width * 2 / 7, 
		height: height / 10,
		marginRight: 10,
	},
	text: {
		fontSize: 24,
		color: '#373737',
	}
})

export default ExerciseDays
