import { StyleSheet, Text, View } from "react-native"
import Constants from "expo-constants"
import { Calendar, CalendarList, Agenda } from "react-native-calendars"
import { LocaleConfig } from "react-native-calendars"

import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getUserRecord } from "../../store/record"
import * as React from "react"
import { record } from "../../api/recordAPI"
import DailyInfo from "./dailyInfo"

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
	dayNames: [
		"일요일",
		"월요일",
		"화요일",
		"수요일",
		"목요일",
		"금요일",
		"토요일"
	],
	dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
	today: "오늘"
}
LocaleConfig.defaultLocale = "kr"
export interface DateData {
	dateString: string
	day: number
	month: number
	timestamp: number
	year: number
}

function MyRecord() {
	const recordList = useAppSelector(state => state.recordList)
	const userId = useAppSelector(state => state.userId)
	const dispatch = useAppDispatch()

	const [dayInfo, setDayInfo] = React.useState<DateData | null>(null)
	const [markedDates, setMarkedDates] = React.useState({})

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
		record
			.recordList(userId.id)
			.then(result => {
				console.log("레코드 결과", result.data)
				dispatch(getUserRecord(result.data))
			})
			.catch(err => console.log(err))
	}, [])

	function markDates() {
		if (recordList.length < 1) return
		let marked = {}
		for (let i = 0; i < recordList.length; i++) {
			;(marked as any)[recordList[0].startDateTime.substring(0, 6)] = {
				marked: true
			}
		}
	}
	return (
		<View style={styles.container}>
			<Calendar
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
				markedDates={{
					"2012-05-16": { selected: true, marked: true, selectedColor: "blue" },
					"2012-05-17": { marked: true },
					"2012-05-18": { marked: true, dotColor: "red", activeOpacity: 0 },
					"2012-05-19": { disabled: true, disableTouchEvent: true }
				}}
			/>
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
		</View>
	)
}

export default MyRecord

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight
	}
})
