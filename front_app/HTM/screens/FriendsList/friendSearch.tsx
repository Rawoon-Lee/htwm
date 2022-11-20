import { StyleSheet, Text, View, TextInput } from "react-native"
import Constants from "expo-constants"
import * as React from "react"
import { FlatList } from "react-native"

import { user } from "../../api/userAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import {
	FriendData,
	getFriendsSearchList,
	initFriendSearchList,
	getSearchInput
} from "../../store/user"

import FriendBox from "./friendBox"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { color } from "../../Style/commonStyle"

function renderItems({ item }: { item: FriendData }) {
	return (
		<View style={{ alignItems: "center" }}>
			<FriendBox
				nickname={item.nickname}
				username={item.username}
				url={item.url}
				status={item.status}
				isSearch={true}
			/>
		</View>
	)
}

function FriendSearch() {
	const dispatch = useAppDispatch()
	const userId = useAppSelector(state => state.userId)
	const friendSearchList = useAppSelector(state => state.friendSearchList)
	const [input, setInput] = React.useState("")
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
	}, [])

	React.useEffect(() => {
		if (!input) {
			dispatch(initFriendSearchList())
			return
		}
		let data = { nickname: input, username: userId.id }
		friendSearchUpdate(data)
	}, [input])
	function friendSearchUpdate(data: any) {
		user
			.friendSearch(data)
			.then(result => {
				dispatch(getFriendsSearchList(result.data))
			})
			.catch(err => console.log(err))
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
		<View style={styles.container} onLayout={onLayoutRootView}>
			<Text style={{ margin: 10 }}>친구검색</Text>
			<TextInput
				onChangeText={text => {
					setInput(text)
					dispatch(getSearchInput(text))
				}}
				placeholder="닉네임을 입력해주세요"
				style={{
					backgroundColor: color.textInputGrey,
					padding: 10,
					borderRadius: 10,
					margin: 10,
					fontFamily: "line-rg",
					fontSize: 20
				}}
			></TextInput>
			<FlatList
				data={friendSearchList}
				keyExtractor={item => item.username}
				renderItem={renderItems}
			></FlatList>
		</View>
	)
}

export default FriendSearch

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
		// marginTop: Constants.statusBarHeight
	}
})
