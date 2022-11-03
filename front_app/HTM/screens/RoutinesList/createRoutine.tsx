import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Pressable,
	Switch,
	ScrollView,
	Dimensions
} from "react-native"
import { commonStyle } from "../../Style/commonStyle"
import * as React from "react"

import { routine } from "../../api/routineAPI"

import { Feather } from "@expo/vector-icons"
import Constants from "expo-constants"
import { Picker } from "@react-native-picker/picker"

interface ExerciseData {
	exercise_id: number
	name: string
	url: string
}

export default function CreateRoutine() {
	const [name, setName] = React.useState("")
	const [exerciseList, setExerciseList] = React.useState<ExerciseData[] | null>(null)
	const [index, setIndex] = React.useState(1)
	const [selectedExercise, setSelectedExercise] = React.useState("")
	const [isEnabled, setIsEnabled] = React.useState(false)
	const toggleSwitch = () => setIsEnabled(previousState => !previousState)

	const [boxes, setBoxes] = React.useState([SetInfoBox(1)])

	React.useEffect(() => {
		routine
			.exerciseList()
			.then(result => {
				setExerciseList(result.data)
				console.log(result.data)
			})
			.catch(err => {
				console.log(err)
			})
	}, [])

	function SetInfoBox(keyNum: number) {
		return (
			<View key={keyNum}>
				<Text>{keyNum}번 세트</Text>
				<Switch
					trackColor={{ false: "#767577", true: "#81b0ff" }}
					thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
					onValueChange={toggleSwitch}
					value={isEnabled}
				/>
				<Picker
					selectedValue={selectedExercise}
					onValueChange={(itemValue, itemIndex) => setSelectedExercise(itemValue)}
				>
					{exerciseList
						? exerciseList.map((exercise, idx) => {
								return <Picker.Item label={exercise.name} value={exercise.exercise_id} key={idx} />
						  })
						: null}
				</Picker>
				{/* disable 로 할지 alert 로 할지 고민중입니다 */}
				<Pressable onPress={deleteSetInfoBox} disabled={keyNum === 1}>
					<Text style={keyNum === 1 ? { color: "grey" } : { color: "black" }}>삭제</Text>
				</Pressable>
			</View>
		)
	}
	function addSetInfoBox() {
		let temp = index + 1
		let tempBox = boxes
		tempBox.push(SetInfoBox(temp))
		setBoxes(tempBox)
		console.log("component add")
		setIndex(temp)
	}
	function deleteSetInfoBox() {
		if (boxes.length <= 1) {
			alert("최소한 1개의 세트는 있어야 합니다")
			return
		}
		let temp = index
		setIndex(temp)
		let tempBox = boxes
		tempBox.pop()
		setBoxes(tempBox)
		console.log("component delete")
	}
	return (
		<View style={commonStyle.containerInner}>
			<ScrollView style={styles.scrollView}>
				<Text>루틴 생성 페이지 입니다</Text>
				<TextInput
					onChangeText={text => {
						setName(text)
					}}
					placeholder="루틴의 이름을 입력해주세요"
				></TextInput>
				{boxes.map((box, idx) => {
					return <View key={idx}>{box}</View>
				})}
				<View>
					<Pressable onPress={addSetInfoBox}>
						<Feather name="plus-circle" size={24} color="black" />
					</Pressable>
				</View>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	scrollView: {
		backgroundColor: "pink",
		marginHorizontal: 10,
		width: Dimensions.get("screen").width
	}
})
