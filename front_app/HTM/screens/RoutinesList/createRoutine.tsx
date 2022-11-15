import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Dimensions } from "react-native"
import { Switch } from "react-native-switch"
import { Picker } from "@react-native-picker/picker"
import { commonStyle } from "../../Style/commonStyle"
import * as React from "react"
import Constants from "expo-constants"

import { routine } from "../../api/routineAPI"
import { RoutineData, SetData } from "../../store/routine"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getRoutineList, initRoutineList } from "../../store/routine"

import { Feather } from "@expo/vector-icons"

export interface ExerciseData {
	exercise_id: number
	name: string
	url: string
}

interface tempSetData extends SetData {
	id: number
}
export default function CreateRoutine({ navigation }: any) {
	const dispatch = useAppDispatch()
	const userId = useAppSelector(state => state.userId)

	const [index, setIndex] = React.useState(0)

	const [boxes, setBoxes] = React.useState<JSX.Element[]>([])
	const colors = ["#00796B", "#DE5788", "#9747FF", "#8FE81E", "#E0BB95"]
	const [selectedColor, setSelectedColor] = React.useState("D2D2FF")

	const [exerciseList, setExerciseList] = React.useState<ExerciseData[] | null>(null)

	// 토글 스위치용
	const [setType, setSetType] = React.useState(true)
	const toggleSwitch = () => setSetType(previousState => !previousState)
	// 인풋 데이터
	const [name, setName] = React.useState("")
	const [selectedExercise, setSelectedExercise] = React.useState("")
	const [time, setTime] = React.useState(10)
	const [num, setNum] = React.useState(0)
	const [set, setSet] = React.useState(0)

	const [sets, setSets] = React.useState<SetData[]>([])

	React.useEffect(() => {
		routine
			.exerciseList()
			.then(result => {
				setExerciseList(result.data)
			})
			.catch(err => {
				console.log(err)
			})
	}, [])

	function addSetInfoBox() {
		// exerciseList 없음
		if (!exerciseList) return
		// 먼저 값이 제대로 들어와 있는지 확인
		console.log("확안용")
		console.log(name, setType, selectedExercise, time, num, set)
		if (!selectedExercise) {
			alert("운동을 선택해주세요")
			return
		}
		if (num === 0 || set === 0) {
			alert("횟수, 세트 수는 0일 수 없습니다.")
			return
		}

		if (time === 0) {
			alert("시간은 0초일 수 없습니다")
			return
		}
		let temp: SetData[] = [
			{
				exercise_id: parseInt(selectedExercise),
				exercise_name: exerciseList[parseInt(selectedExercise) - 1].name,
				number: num,
				sec: 0,
				set_cnt: set
			},
			{
				exercise_id: 1,
				exercise_name: "휴식",
				number: 0,
				sec: time,
				set_cnt: 0
			}
		]
		// let list = sets
		// list.push(temp)
		setSets(sets.concat(temp))
		console.log(sets)
	}

	function deleteSetInfoBox() {
		let temp = index
		setIndex(temp)
		let tempBox = boxes
		tempBox.pop()
		setBoxes(tempBox)
		console.log("component delete")
	}

	function createRoutine() {
		// 이름 비어있으면 안됨
		if (!userId.id) {
			alert("로그인을 먼저 진행해주세요")
			return
		} else if (!name) {
			alert("루틴의 이름을 지어주세요")
			return
		}
		let data: RoutineData = {
			color: selectedColor,
			name: name,
			username: userId.id,
			sets: sets
		}

		console.log(JSON.stringify(sets))
		routine
			.routineCreate(data)
			.then(result => {
				console.log("생성 성공")
				console.log(result.data)
				updateReduxRoutineList()
				alert("루틴이 등록되었습니다")
				navigation.navigate("RoutineList")
			})
			.catch(err => {
				console.log("실패했습니다")
				console.log(err)
				alert(err.response.data)
			})
	}

	function updateReduxRoutineList() {
		if (!userId.id) {
			dispatch(initRoutineList())
			return
		}
		routine
			.routineList(userId.id)
			.then(result => {
				console.log(result.data)
				dispatch(getRoutineList(result.data))
			})
			.catch(err => {
				console.log(err)
			})
	}
	function resetRoutine() {
		setSets([])
	}
	function changeTime(num: number) {
		if (!num) return
		if (num > 3600) {
			alert("휴식시간은 60분을 넘을 수 없습니다")
			return
		}
		if (num == 0) {
			alert(`휴식시간은 0초일 수 없습니다.${"\n"}최소 10초여야 합니다`)
			return
		}
		setTime(num)
	}
	return (
		<View style={commonStyle.containerInner}>
			<ScrollView style={styles.scrollView}>
				<TextInput
					style={styles.textInput}
					onChangeText={text => {
						setName(text)
					}}
					placeholder="루틴의 이름을 입력해주세요"
				></TextInput>
				<View
					style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}
				>
					{colors.map((color, idx) => {
						return (
							<View key={idx}>
								<Pressable
									onPress={() => {
										setSelectedColor(color), console.log(selectedColor)
									}}
								>
									<View
										style={[
											styles.colorCircle,
											color == selectedColor
												? {
														backgroundColor: color,
														borderRadius: 40,
														width: 40,
														height: 40
												  }
												: {
														backgroundColor: color
												  }
										]}
									></View>
								</Pressable>
							</View>
						)
					})}
				</View>
				<View style={styles.exerciseInput}>
					{/* <Switch
						backgroundActive={"#FAFAFA"}
						backgroundInactive={"#FAFAFA"}
						circleBorderWidth={0}
						circleActiveColor={"#00BEA4"}
						circleInActiveColor={"#CBCBCB"}
						onValueChange={toggleSwitch}
						value={setType}
						activeText={"운동"}
						inActiveText={"휴식"}
						circleSize={30}
						switchLeftPx={5}
						switchRightPx={5}
						activeTextStyle={{ color: "black", textAlign: "center" }}
						inactiveTextStyle={{ color: "black", textAlign: "center" }}
						changeValueImmediately={true}
					/> */}
					<View>
						<Text>운동종류를 골라주세요</Text>
						<Picker
							style={styles.picker}
							selectedValue={selectedExercise}
							onValueChange={(itemValue, itemIndex) => setSelectedExercise(itemValue)}
						>
							{exerciseList
								? exerciseList
										.filter(exercise => exercise.exercise_id !== 1)
										.map((exercise, idx) => {
											return exercise.exercise_id == 0 ? null : (
												<Picker.Item label={exercise.name} value={exercise.exercise_id} key={idx} />
											)
										})
								: null}
						</Picker>
						<View style={styles.exerciseNumInput}>
							<TextInput
								style={styles.textInput_sm}
								onChangeText={text => {
									setNum(parseInt(text))
								}}
								// placeholder="횟수를 설정해주세요"
								keyboardType={"numeric"}
							></TextInput>
							<Text>회</Text>
							<TextInput
								style={styles.textInput_sm}
								onChangeText={text => {
									setSet(parseInt(text))
								}}
								// placeholder="세트 수 설정해주세요"
								keyboardType={"numeric"}
							></TextInput>
							<Text>세트</Text>
						</View>
					</View>
					<View>
						<Text>휴식</Text>
						<TextInput
							style={styles.textInput_sm}
							onChangeText={text => {
								changeTime(parseInt(text))
							}}
							defaultValue={"10"}
							// placeholder="휴식시간을 설정해주세요"
							keyboardType={"numeric"}
						></TextInput>
						<Text>초</Text>
					</View>
				</View>
				<View>
					<Pressable onPress={addSetInfoBox} style={styles.addButton}>
						<Feather name="plus-circle" size={24} color="white" />
						<Text style={styles.addButtonText}>추가</Text>
					</Pressable>
				</View>
				{sets.map((set, idx) => {
					return set.exercise_id === 1 ? (
						<View key={idx}>
							<Text>{set.exercise_name}</Text>
							<View style={styles.exerciseInfo}>
								<Text>휴식 시간</Text>
								<Text>{set.sec}</Text>
							</View>
						</View>
					) : (
						<View key={idx}>
							<View style={styles.exerciseInfo}>
								<Text>운동이름</Text>
								<Text>{set.exercise_name}</Text>
							</View>
							<View style={styles.exerciseInfo}>
								<Text>회</Text>
								<Text>{set.number}</Text>
							</View>
							<View style={styles.exerciseInfo}>
								<Text>세트</Text>
								<Text>{set.set_cnt}</Text>
							</View>
						</View>
					)
				})}
				<View>
					<Pressable onPress={resetRoutine} style={styles.addButton}>
						<Text style={styles.addButtonText}>리셋</Text>
					</Pressable>
				</View>
				<View>
					<Pressable onPress={createRoutine} style={styles.addButton}>
						<Text style={styles.addButtonText}>등록</Text>
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
	},
	addButton: {
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "white",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		backgroundColor: "green"
	},
	addButtonText: {
		color: "white",
		marginLeft: 10
	},
	textInput: {
		backgroundColor: "#FFFFFF",
		width: Dimensions.get("screen").width - 50,
		borderRadius: 7,
		borderWidth: 1,
		borderColor: "#727272"
	},
	textInput_sm: {
		backgroundColor: "#FFFFFF",
		width: 50,
		borderRadius: 7,
		borderWidth: 1,
		borderColor: "#727272"
	},
	picker: {
		backgroundColor: "white",
		borderRadius: 10
	},
	exerciseInput: {
		width: Dimensions.get("screen").width,
		borderRadius: 7,
		borderWidth: 1,
		borderColor: "#727272"
	},
	exerciseNumInput: {
		flexDirection: "row"
	},
	exerciseInfo: {
		width: Dimensions.get("screen").width,
		borderRadius: 7,
		flexDirection: "row"
	},
	colorCircle: {
		borderRadius: 35,
		width: 35,
		height: 35,
		margin: 15
	}
})
