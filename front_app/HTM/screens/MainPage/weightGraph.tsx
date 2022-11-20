import { StyleSheet, Text, View } from "react-native"
import * as React from "react"

import { user } from "../../api/userAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getWeightList, WeightData, getWeightListWeek } from "../../store/user"

import { Dimensions } from "react-native"
const screenWidth = Dimensions.get("window").width

export default function WeightGraph() {
	const dispatch = useAppDispatch()

	const userId = useAppSelector(state => state.userId)
	const weightList = useAppSelector(state => state.weightList)
	// const weightListWeek = useAppSelector(state => state.weightListWeek)
	const [weightListWeek, setWeightListWeek] = React.useState<(number | null)[]>([])
	const [weekData, setWeekData] = React.useState<number[]>([0])

	let today = new Date()
	let dayToday = today.getDate()

	let weekDates: string[] = []
	let weekLabel: string[] = []
	for (let i = 7; i >= 0; i--) {
		let temp = new Date(new Date().setDate(dayToday - i)).toISOString().slice(0, 10)
		weekDates.push(temp)
		weekLabel.push(temp.slice(5, 10))
	}

	React.useEffect(() => {
		user
			.weightList(userId.id)
			.then(result => {
				dispatch(getWeightList(result.data))
				// dispatch(getWeightListWeek(weightList.filter(item => weekDates.some(i => i === item.date))))
			})
			.catch(err => console.log(err))

		if (weightListWeek.length == 7) return
		for (let w of weightList) {
			let found = false
			for (let i = 7; i >= 0; i--) {
				if (w.date == weekDates[i]) {
					setWeightListWeek(weightListWeek.concat(w.weight))
					found = true
					break
				}
				if (!found) {
					setWeightListWeek(weightListWeek.concat(null))
				}
			}
		}
	}, [])

	return (
		<View style={styles.container}>
			<Text style={styles.text}>일주일간의 몸무게 변화</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		elevation: 4,
		padding: 20
	},
	text: {
		fontSize: 25
	}
})
