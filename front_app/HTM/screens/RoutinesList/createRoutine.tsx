import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Dimensions } from "react-native"
import { Picker } from "@react-native-picker/picker"
import * as React from "react"
import Constants from "expo-constants"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

import { routine } from "../../api/routineAPI"
import { RoutineData, SetData } from "../../store/routine"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getRoutineList, initRoutineList } from "../../store/routine"

import { Feather } from "@expo/vector-icons"
import { color } from "../../Style/commonStyle"

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
	const [selectedColor, setSelectedColor] = React.useState("#8686ff")

	const [exerciseList, setExerciseList] = React.useState<ExerciseData[] | null>(null)

	// 토글 스위치용
	const [setType, setSetType] = React.useState(true)
	const toggleSwitch = () => setSetType(previousState => !previousState)
	// 인풋 데이터
	const [name, setName] = React.useState("")
	const [selectedExercise, setSelectedExercise] = React.useState("")
	const [breakTime, setBreakTime] = React.useState(20)
	const [num, setNum] = React.useState(0)
	const [set, setSet] = React.useState(0)
	const [minTime, setMinTime] = React.useState(0)
	const [secTime, setSecTime] = React.useState(0)

	const [sets, setSets] = React.useState<SetData[]>([])
	const [fontsLoaded] = useFonts({
		"line-rg": require("../../assets/fonts/LINESeedKR-Rg.ttf"),
		"line-bd": require("../../assets/fonts/LINESeedKR-Bd.ttf")
	})
	React.useEffect(() => {
		// 폰트 불러오기
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
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
		if (!selectedExercise) {
			alert("운동을 선택해주세요")
			return
		}
		if (num === 0 || set === 0) {
			alert("횟수, 세트 수는 0일 수 없습니다.")
			return
		}

		if (breakTime < 20) {
			alert("시간은 10보다 작을 수 없습니다")
			return
		}
		let temp: SetData[] = [
			{
				exercise_id: parseInt(selectedExercise),
				exercise_name: exerciseList[parseInt(selectedExercise) - 1].name,
				number: num,
				sec: minTime * 60 + secTime,
				set_cnt: set
			},
			{
				exercise_id: 1,
				exercise_name: "휴식",
				number: 0,
				sec: breakTime,
				set_cnt: 0
			}
		]
		// let list = sets
		// list.push(temp)
		setSets(sets.concat(temp))
	}

	function deleteSetInfoBox() {
		let temp = index
		setIndex(temp)
		let tempBox = boxes
		tempBox.pop()
		setBoxes(tempBox)
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
			sets: sets.slice(0, -1)
		}

		routine
			.routineCreate(data)
			.then(result => {
				updateReduxRoutineList()
				alert("루틴이 등록되었습니다")
				navigation.navigate("RoutineList")
			})
			.catch(err => {
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
		// if (num < 10) {
		// 	alert(`휴식시간은 10초보다 작을 수 없습니다.`)
		// 	return
		// }
		setBreakTime(num)
	}

	const onLayoutRootView = React.useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync()
		}
	}, [fontsLoaded])

	if (!fontsLoaded) {
		return null
	}
	return (
		<View style={styles.containerInner} onLayout={onLayoutRootView}>
			<ScrollView style={styles.scrollView}>
				<View style={{ alignItems: "center" }}>
					<TextInput
						style={[styles.textInput, { fontFamily: "line-rg" }]}
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
											setSelectedColor(color)
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
						<View style={{ alignItems: "center" }}>
							<Text style={{ fontSize: 22, margin: 10, fontFamily: "line-bd" }}>
								👟 운동종류를 골라주세요
							</Text>
							<View
								style={{
									borderWidth: 3,
									borderColor: color.textInputGrey,
									borderRadius: 10,
									padding: 1,
									margin: 10
								}}
							>
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
														<Picker.Item
															label={exercise.name}
															value={exercise.exercise_id}
															key={idx}
														/>
													)
												})
										: null}
								</Picker>
							</View>
							<View style={styles.exerciseNumInput}>
								<Text style={{ fontSize: 20, padding: 5, fontFamily: "line-bd" }}>목표 횟수 </Text>
								<TextInput
									style={styles.textInput_sm}
									onChangeText={text => {
										setNum(parseInt(text))
									}}
									// placeholder="횟수를 설정해주세요"
									keyboardType={"numeric"}
								></TextInput>
								<Text style={{ fontSize: 20, padding: 5, fontFamily: "line-rg" }}> 회 </Text>
								<TextInput
									style={styles.textInput_sm}
									onChangeText={text => {
										setSet(parseInt(text))
									}}
									// placeholder="세트 수 설정해주세요"
									keyboardType={"numeric"}
								></TextInput>
								<Text style={{ fontSize: 20, padding: 5, fontFamily: "line-rg" }}> 세트</Text>
							</View>
							<View style={{ alignItems: "center" }}>
								<View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
									<Text style={{ fontSize: 20, padding: 5, fontFamily: "line-bd" }}>
										목표 시간{" "}
									</Text>
									<TextInput
										style={styles.textInput_sm}
										onChangeText={text => {
											setMinTime(parseInt(text))
										}}
										// placeholder="횟수를 설정해주세요"
										keyboardType={"numeric"}
									></TextInput>
									<Text style={{ fontSize: 20, padding: 5, fontFamily: "line-rg" }}> 분 </Text>
									<TextInput
										style={styles.textInput_sm}
										onChangeText={text => {
											setSecTime(parseInt(text))
										}}
										// placeholder="횟수를 설정해주세요"
										keyboardType={"numeric"}
									></TextInput>
									<Text
										style={{ fontSize: 20, padding: 5, fontFamily: "line-rg" }}
									>{` 초    `}</Text>
								</View>
							</View>
						</View>
						<View style={{ alignItems: "center" }}>
							<Text style={{ fontSize: 22, margin: 10, marginTop: 25, fontFamily: "line-bd" }}>
								⏰ 휴식시간을 설정해주세요
							</Text>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<TextInput
									style={styles.textInput_sm}
									onChangeText={text => {
										changeTime(parseInt(text))
									}}
									defaultValue={"20"}
									// placeholder="휴식시간을 설정해주세요"
									keyboardType={"numeric"}
								></TextInput>
								<Text style={{ fontSize: 20, padding: 5, fontFamily: "line-rg" }}> 초</Text>
							</View>
						</View>
					</View>
					<View>
						<Pressable
							onPress={addSetInfoBox}
							style={[
								styles.addButton,
								{
									backgroundColor: "lightgreen",
									flexDirection: "row",
									justifyContent: "center"
								}
							]}
						>
							<Feather name="plus-circle" size={24} color="white" />
						</Pressable>
					</View>
					{sets.map((set, idx) => {
						return set.exercise_id === 1 ? (
							<View key={idx} style={[styles.setsStyle, { marginBottom: 10 }]}>
								<Text style={{ fontFamily: "line-bd", fontSize: 20 }}>휴식 </Text>
								<Text style={{ fontFamily: "line-rg", fontSize: 20, marginLeft: 10 }}>
									{set.sec} 초
								</Text>
							</View>
						) : (
							<View key={idx} style={[styles.setsStyle, { marginTop: 10 }]}>
								<Text style={{ fontFamily: "line-bd", fontSize: 20 }}>{set.exercise_name}</Text>
								<Text style={{ fontFamily: "line-rg", fontSize: 20, marginLeft: 10 }}>
									{set.number} 회
								</Text>
								<Text style={{ fontFamily: "line-rg", fontSize: 20, marginLeft: 10 }}>
									{set.set_cnt} 세트
								</Text>
							</View>
						)
					})}

					<View style={{ marginTop: 10 }}>
						<Pressable
							onPress={createRoutine}
							style={[styles.addButton, { backgroundColor: "skyblue", marginBottom: 0 }]}
						>
							<Text
								style={{
									color: "white",
									paddingVertical: 3,
									textAlign: "center",
									fontFamily: "line-bd",
									fontSize: 18
								}}
							>
								등록
							</Text>
						</Pressable>
					</View>
					<View>
						<Pressable
							onPress={resetRoutine}
							style={[
								styles.addButton,
								{
									backgroundColor: "white",
									borderWidth: 2,
									borderRadius: 10,
									borderColor: color.textInputGrey
								}
							]}
						>
							<Text
								style={{
									color: color.danger,
									paddingVertical: 3,
									textAlign: "center",
									fontFamily: "line-bd",
									fontSize: 15
								}}
							>
								리셋
							</Text>
						</Pressable>
					</View>
				</View>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	containerInner: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		flex: 1
	},
	scrollView: {
		marginHorizontal: 10,
		width: Dimensions.get("screen").width
	},
	addButton: {
		backgroundColor: `#D2D6FF`,
		padding: 10,
		borderRadius: 7,
		margin: 10,
		width: (Dimensions.get("screen").width * 9) / 10
		// marginVertical: 6
	},
	textInput: {
		backgroundColor: color.textInputGrey,
		width: (Dimensions.get("screen").width * 9) / 10,
		padding: 10,
		borderRadius: 10,
		margin: 10,
		fontFamily: "line-rg",
		fontSize: 15
	},
	textInput_sm: {
		backgroundColor: color.textInputGrey,
		width: Dimensions.get("screen").width / 8,
		// height: Dimensions.get("screen").width / 14,
		padding: 5,
		borderRadius: 8,
		fontFamily: "line-rg",
		fontSize: 20,
		textAlign: "center"
	},
	picker: {
		backgroundColor: "white",
		width: (Dimensions.get("screen").width * 8) / 10,
		fontSize: 20
	},
	exerciseInput: {
		width: (Dimensions.get("screen").width * 9) / 10
		// borderRadius: 7,
		// borderWidth: 1,
		// borderColor: "#727272"
	},
	exerciseNumInput: {
		flexDirection: "row",
		alignItems: "center"
	},
	exerciseInfo: {
		width: Dimensions.get("screen").width,
		fontFamily: "line-rg"
	},
	colorCircle: {
		borderRadius: 35,
		width: 35,
		height: 35,
		margin: 15
	},
	setsStyle: {
		width: (Dimensions.get("screen").width * 9) / 10,
		paddingLeft: 10,
		paddingRight: 10,
		marginLeft: 10,
		marginRight: 10,
		flexDirection: "row"
	}
})
