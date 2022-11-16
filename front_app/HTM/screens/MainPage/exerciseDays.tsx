import { StyleSheet, Text, View, Dimensions } from "react-native"
import * as React from "react"

import { record } from "../../api/recordAPI"
import { useAppSelector } from "../../store/hook"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width
function ExerciseDays() {
	const userId = useAppSelector(state => state.userId)
	const [daysCont, setDaysCont] = React.useState(0)

	React.useEffect(() => {
		let today = new Date()
		let year = today.getFullYear()
		let month = ("0" + (today.getMonth() + 1)).slice(-2)
		let day = ("0" + today.getDate()).slice(-2)
		let dateString = year + "-" + month + "-" + day
		let data = {
			username: userId.id,
			date: dateString
		}
		record
			.recordDays(data)
			.then(result => {})
			.catch(err => {
				console.log(err)
			})
	}, [])
	return (
		<View style={styles.container}>
			<Text style={{ fontSize: 12, color: "#727272" }}>연속 운동 일자</Text>
			<Text style={styles.text}>{daysCont}</Text>
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
		width: width / 2.5,
		height: height / 9,
		marginRight: 10
	},
	text: {
		fontSize: 24,
		color: "#373737"
	}
})

export default ExerciseDays
