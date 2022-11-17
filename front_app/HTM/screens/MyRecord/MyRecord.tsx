import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native"
import Constants from "expo-constants"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { Calendar } from "react-native-calendars"
import { LocaleConfig } from "react-native-calendars"
import * as React from "react"

import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getUserRecord } from "../../store/record"
import { record } from "../../api/recordAPI"
import { picture } from "../../api/pictureAPI"
import { user } from "../../api/userAPI"
import { getPicList } from "../../store/picture"
import { getWeightList } from "../../store/user"
import routine from "../../store/routine"

import DailyInfo from "./dailyInfo"

export interface DateData {
	dateString: string
	day: number
	month: number
	timestamp: number
	year: number
}

type ObjType = {
	[index: string]: Object
}

let height = Dimensions.get("screen").height

function MyRecord() {
	const tabBarHeight = height / 2.5 + 10

	const userId = useAppSelector(state => state.userId)
	// const userId = {
	// 	id: "b"
	// }
	const recordList = useAppSelector(state => state.recordList)
	const picList = useAppSelector(state => state.picList)
	const weightList = useAppSelector(state => state.weightList)
	const dispatch = useAppDispatch()

	const [dayInfo, setDayInfo] = React.useState<DateData | null>(null)
	const [markedDates, setMarkedDates] = React.useState<ObjType>({})

	React.useEffect(() => {
		let today = new Date()
		let year = today.getFullYear()
		let month = ("0" + (today.getMonth() + 1)).slice(-2)
		let day = ("0" + today.getDate()).slice(-2)
		let dateString = year + "-" + month + "-" + day
		let todayInfo: DateData = {
			dateString: dateString,
			day: Number(day),
			month: Number(month),
			timestamp: 0,
			year: year
		}
		setDayInfo(todayInfo)
		// 나중에 test 이후에 주석풀어야 됨
		// 실수로라도 지우지마삼
		// 그러면 조금 슬플 것 같음
		record
			.recordList(userId.id)
			.then(result => {
				// console.log("레코드 결과", result.data)
				dispatch(getUserRecord(result.data))
				markDates()
			})
			.catch(err => console.log(err))
		user
			.weightList(userId.id)
			.then(result => {
				dispatch(getWeightList(result.data))
			})
			.catch(err => console.log(err))
	}, [])

	React.useEffect(() => {
		markDates()
	}, [recordList])

	React.useEffect(() => {
		markDates()
	}, [weightList])

	React.useEffect(() => {
		markDates()
	}, [picList])

	function markDates() {
		let container = {
			backgroundColor: "#D2D2FF"
		}
		let text = {
			color: "white",
			fontWeight: "bold"
		}
		let customStyles = {
			container: container,
			text: text
		}
		let setting = {
			customStyles: customStyles
		}
		for (let i = 0; i < recordList.length; i++) {
			markedDates[recordList[i].startDateTime.slice(0, 10)] = setting
			setMarkedDates({ ...markedDates })
		}
		for (let i = 0; i < weightList.length; i++) {
			markedDates[weightList[i].date] = setting
			setMarkedDates({ ...markedDates })
		}
		for (let i = 1; i <= 30; i++) {
			let num = String(i)
			if (i < 10) {
				num = "0" + String(i)
			}
			let date = `2022-11-${num}`
			let data = { username: userId.id, date: date }
			picture
				.pictureList(data)
				.then(result => {
					console.log("사진가져왔음")
					console.log(result.data)
					if (result.data.length >= 1) {
						markedDates[date] = setting
						setMarkedDates({ ...markedDates })
					}
				})
				.catch(err => {
					console.log("오늘의 사진 못가져옴")
					console.log(err)
				})
		}
	}
	console.log("marked", markedDates)

	return (
		<View style={styles.container}>
			<Calendar
				style={{ width: Dimensions.get("screen").width }}
				// Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
				minDate={"2022-01-01"}
				// Handler which gets executed on day press. Default = undefined
				onDayPress={day => {
					setDayInfo(day)
				}}
				// Handler which gets executed on day long press. Default = undefined
				onDayLongPress={day => {
					console.log("selected day", day)
				}}
				// Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
				monthFormat={"yyyy MM"}
				// Handler which gets executed when visible month changes in calendar. Default = undefined
				onMonthChange={month => {
					console.log("month changed", month)
				}}
				// Do not show days of other months in month page. Default = false
				hideExtraDays={true}
				// If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
				// If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
				firstDay={1}
				// Handler which gets executed when press arrow icon left. It receive a callback can go back month
				onPressArrowLeft={subtractMonth => subtractMonth()}
				// Handler which gets executed when press arrow icon right. It receive a callback can go next month
				onPressArrowRight={addMonth => addMonth()}
				// Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
				enableSwipeMonths={true}
				markingType={"custom"}
				markedDates={markedDates}
			/>
			<ScrollView style={{ marginBottom: tabBarHeight }}>
				{dayInfo ? (
					<DailyInfo
						dateString={dayInfo?.dateString}
						day={dayInfo?.day}
						month={dayInfo?.month}
						timestamp={dayInfo?.timestamp}
						year={dayInfo?.year}
					></DailyInfo>
				) : (
					<Text>날짜를 선택해 주세요</Text>
				)}
			</ScrollView>
		</View>
	)
}

export default MyRecord

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		backgroundColor: "white"
	}
})

LocaleConfig.locales["kr"] = {
	monthNames: [
		"1월",
		"2월",
		"3월",
		"4월",
		"5월",
		"6월",
		"7월",
		"8월",
		"9월",
		"10월",
		"11월",
		"12월"
	],
	monthNamesShort: [
		"Janv.",
		"Févr.",
		"Mars",
		"Avril",
		"Mai",
		"Juin",
		"Juil.",
		"Août",
		"Sept.",
		"Oct.",
		"Nov.",
		"Déc."
	],
	dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
	dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
	today: "오늘"
}
LocaleConfig.defaultLocale = "kr"
