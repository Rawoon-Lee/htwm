import { StyleSheet, Text, View, Image, ScrollView, Dimensions } from "react-native"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"

import * as React from "react"
import ImageModal from "react-native-image-modal"

import moment from "moment"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { exerciseColor, color } from "../../Style/commonStyle"

import { useAppSelector, useAppDispatch } from "../../store/hook"
import { picture } from "../../api/pictureAPI"
import { user } from "../../api/userAPI"
import { getPicList } from "../../store/picture"
import { getWeightList } from "../../store/user"

import { RecordData, StreamingData } from "../../store/record"
import { WeightData } from "../../store/user"
import { DateData } from "../MyRecord/MyRecord"

const width = Dimensions.get("screen").width

export default function DailyInfo(props: DateData) {
	const tabBarHeight = useBottomTabBarHeight() * 2
	const dispatch = useAppDispatch()

	const userId = useAppSelector(state => state.userId)
	const recordList = useAppSelector(state => state.recordList)
	const picList = useAppSelector(state => state.picList)
	const weightList = useAppSelector(state => state.weightList)
	const streamingList = useAppSelector(state => state.streamingList)

	const [fontsLoaded] = useFonts({
		"line-rg": require("../../assets/fonts/LINESeedKR-Rg.ttf"),
		"line-bd": require("../../assets/fonts/LINESeedKR-Bd.ttf")
	})

	let dailyRecord = recordList.filter(
		(item: RecordData) => item.startDateTime.slice(0, 10) == props.dateString
	)
	let dayWeight = weightList.filter((item: WeightData) => item.date == props.dateString)
	let dailyStreming = streamingList.filter(
		(item: StreamingData) => item.startTime.slice(0, 10) == props.dateString
	)
	React.useEffect(() => {
		// 폰트 불러오기
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
	}, [])

	React.useEffect(() => {
		dailyRecord = recordList.filter(
			(item: RecordData) => item.startDateTime.slice(0, 10) == props.dateString
		)
		let data = { username: userId.id, date: props.dateString }
		picture
			.pictureList(data)
			.then(result => {
				dispatch(getPicList(result.data))
			})
			.catch(err => {
				console.log("오늘의 사진 못가져옴")
			})

		user
			.weightList(userId.id)
			.then(result => {
				dispatch(getWeightList(result.data))
				dayWeight = weightList.filter((item: WeightData) => item.date == props.dateString)
			})
			.catch(err => console.log(err))
	}, [props.timestamp])

	function msToTime(diff: number) {
		let duration = moment.duration(diff)
		let seconds: number = duration.asSeconds()
		let minute: number = parseInt(String(duration.asMinutes()))
		let hours: number = duration.asHours()

		// 그래서 사용할 때는 parseInt 를 사용해 int 로 바꿔야 한다.
		if (minute < 1) {
			// 1분 미만이면 초 단위로 보여주고,
			return seconds.toString() + "초"
		} else if (hours < 1) {
			// 1시간 미만이면 분 단위로 보여주고
			return minute.toString() + "분" + " " + (seconds % 60).toString() + "초"
		} else {
			// 하루 미만이면 시간으로 보여주고
			return (
				hours.toString() +
				"시간 " +
				(minute % 60).toString() +
				"분" +
				(seconds % 60).toString() +
				"초"
			)
		}
	}

	function stampToTime(timestamp: string) {
		const hour = timestamp.slice(11, 13)
		const min = timestamp.slice(14, 16)
		if (parseInt(hour) < 12) return "오전 " + hour + " : " + min
		return "오후 " + hour + " : " + min
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
		<View onLayout={onLayoutRootView} style={{ justifyContent: "center", alignItems: "center" }}>
			{dailyRecord.length >= 1 ||
			picList.length >= 1 ||
			dayWeight.length >= 1 ||
			dailyStreming.length >= 1 ? (
				<View>
					{dayWeight.length >= 1 && (
						<View>
							<View style={{ backgroundColor: "#EBEDFF", width: width }}>
								<Text style={{ fontSize: 25, fontFamily: "line-bd", padding: 5 }}>몸무게</Text>
							</View>
							<View style={{ flexDirection: "row", margin: 10 }}>
								<Image
									style={{ width: 25, height: 25, margin: 10 }}
									source={require("./../../assets/scale.png")}
								/>
								<Text
									style={{
										fontFamily: "line-bd",
										fontSize: 23,
										padding: 5,
										margin: 10,
										marginLeft: 0
									}}
								>
									{dayWeight[0].weight}kg
								</Text>
							</View>
						</View>
					)}
					{picList.length >= 1 && (
						<View style={{ marginBottom: 10 }}>
							<View style={{ backgroundColor: "#EBEDFF", width: width, marginBottom: 10 }}>
								<Text style={{ fontSize: 25, fontFamily: "line-bd", padding: 5 }}>사진</Text>
							</View>
							<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
								{picList.map((item, idx) => {
									return (
										<View key={idx} style={{ backgroundColor: "#fff" }}>
											<ImageModal
												resizeMode="contain"
												imageBackgroundColor="#fff"
												source={{ uri: item.url }}
												style={{
													width: 110,
													height: 90,
													marginHorizontal: 5,
													marginVertical: 2
												}}
											/>
										</View>
									)
								})}
							</View>
						</View>
					)}
					{dailyStreming.length >= 1 && (
						<View>
							<View style={{ backgroundColor: "#EBEDFF", width: width }}>
								<Text style={{ fontSize: 25, fontFamily: "line-bd", padding: 5 }}>플레이</Text>
							</View>
							{dailyStreming.map((item: StreamingData, idx) => {
								return (
									<View key={idx} style={{ margin: 10 }}>
										<View style={{ flexDirection: "row" }}>
											<Image
												style={{ width: 25, height: 25, margin: 10 }}
												source={require("./../../assets/dumbbell.png")}
											/>
											<View style={{ margin: 5 }}>
												<Text style={{ fontSize: 23, fontFamily: "line-bd", padding: 5 }}>
													{item.otherNickname}
												</Text>
												<Text
													style={{
														fontFamily: "line-rg",
														fontSize: 20,
														padding: 5,
														lineHeight: 23
													}}
												>
													{stampToTime(item.startTime)}
												</Text>
												<View>
													<Text
														style={{
															fontFamily: "line-rg",
															fontSize: 20,
															padding: 5,
															lineHeight: 23,
															marginBottom: 10
														}}
													>
														{`운동시간 :  `}
														{msToTime(Date.parse(item.endTime) - Date.parse(item.startTime))}
													</Text>
												</View>
											</View>
										</View>
									</View>
								)
							})}
						</View>
					)}
					{dailyRecord.length >= 1 && (
						<View>
							<View style={{ backgroundColor: "#EBEDFF", width: width }}>
								<Text style={{ fontSize: 25, fontFamily: "line-bd", padding: 5 }}>운동</Text>
							</View>
							{dailyRecord.map((item, idx) => {
								return (
									<View key={idx} style={{ margin: 10 }}>
										<View style={{ flexDirection: "row" }}>
											<Image
												style={{ width: 25, height: 25, margin: 10 }}
												source={require("./../../assets/dumbbell.png")}
											/>
											<View style={{ margin: 5 }}>
												<Text style={{ fontSize: 23, fontFamily: "line-bd", padding: 5 }}>
													{JSON.parse(item.routineJson).name}
												</Text>
												<View>
													<Text
														style={{
															fontFamily: "line-rg",
															fontSize: 20,
															padding: 5,
															lineHeight: 23
														}}
													>
														{stampToTime(item.startDateTime)}
													</Text>
													<Text
														style={{
															fontFamily: "line-rg",
															fontSize: 20,
															padding: 5,
															lineHeight: 23,
															marginBottom: 10
														}}
													>
														{`운동시간 :${"\t"}`}
														{msToTime(
															Date.parse(item.endDateTime) - Date.parse(item.startDateTime)
														)}
														{`${"\n"}루틴 진행률 :${"  "}`}
														{item.doneSetNum}%
													</Text>
												</View>
												<View style={{ paddingLeft: 4 }}>
													{JSON.parse(item.routineJson).sets.map((set: any, id: number) => {
														if (set.exercise_name == "휴식") return
														return (
															<View
																key={id}
																style={{
																	flexDirection: "row",
																	padding: 1,
																	alignItems: "center",
																	marginTop: 3
																}}
															>
																<Text
																	style={{
																		fontFamily: "line-bd",
																		fontSize: 16,
																		padding: 5,
																		paddingHorizontal: 9,
																		borderRadius: 8,
																		backgroundColor: `${exerciseColor[set.exercise_name]}`,
																		marginRight: 5
																	}}
																>{`${set.exercise_name}`}</Text>
																<Text style={{ fontFamily: "line-rg", fontSize: 18 }}>
																	{`${set.number}${"  "}개`}
																</Text>
															</View>
														)
													})}
												</View>
											</View>
										</View>
									</View>
								)
							})}
						</View>
					)}
				</View>
			) : (
				<View style={{ margin: 10 }}>
					<Text style={{ fontFamily: "line-rg", fontSize: 25 }}>😥 아직 운동기록이 없군요</Text>
				</View>
			)}
		</View>
	)
}
