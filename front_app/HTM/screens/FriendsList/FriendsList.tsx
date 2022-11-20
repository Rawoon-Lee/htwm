import { StyleSheet, Text, View, Pressable, FlatList, ScrollView, Dimensions } from "react-native"
import Constants from "expo-constants"
import * as React from "react"

import { user } from "../../api/userAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getFriendsList, initFriendList } from "../../store/user"

import FriendBox from "./friendBox"
import { FriendData } from "../../store/user"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { withRepeat } from "react-native-reanimated"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

function renderItems({ item }: { item: FriendData }) {
	return (
		<FriendBox nickname={item.nickname} username={item.username} url={item.url} isSearch={false} />
	)
}
const wait = (timeout: number) => {
	return new Promise(resolve => setTimeout(resolve, timeout))
}
function FriendsList({ navigation }: any) {
	const userId = useAppSelector(state => state.userId)
	const friendList = useAppSelector(state => state.friendList)
	const dispatch = useAppDispatch()
	const [refreshing, setRefreshing] = React.useState(false)
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
		if (!userId.id) {
			dispatch(initFriendList())
			return
		}
		user
			.friendList(userId.id)
			.then(result => {
				dispatch(getFriendsList(result.data))
			})
			.catch(err => console.log(err))
	}, [userId.id])

	function handleRefreshing() {
		setRefreshing(true)
		user
			.friendList(userId.id)
			.then(result => {
				dispatch(getFriendsList(result.data))
			})
			.catch(err => console.log(err))
		wait(1000).then(() => setRefreshing(false))
	}
	function moveToSearch() {
		navigation.navigate("FriendSearch")
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
			<View
				style={{
					width: width
				}}
			>
				<Text
					style={{
						fontSize: 30,
						paddingVertical: 10,
						paddingLeft: 20,
						fontFamily: "line-bd"
					}}
				>
					친구 목록
				</Text>
			</View>
			<View style={{ width: (width * 9) / 10, alignItems: "flex-end", marginBottom: 10 }}>
				<Pressable style={styles.button} onPress={moveToSearch}>
					<Text
						style={{
							fontFamily: "line-bd",
							fontSize: 18,
							color: "white"
						}}
					>
						친구추가
					</Text>
				</Pressable>
			</View>
			{friendList.length >= 1 ? (
				<FlatList
					data={friendList}
					keyExtractor={item => item.username}
					renderItem={renderItems}
					refreshing={refreshing}
					onRefresh={handleRefreshing}
				></FlatList>
			) : (
				<Text style={{ fontFamily: "line-rg", fontSize: 25 }}>😥 아직 친구가 없군요</Text>
			)}
		</View>
	)
}

export default FriendsList

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		marginTop: Constants.statusBarHeight,
		backgroundColor: "#fff"
	},
	button: {
		borderRadius: 8,
		overflow: "hidden",
		borderStyle: "solid",
		paddingHorizontal: 15,
		paddingVertical: 8,
		backgroundColor: "lightgreen",
		flexDirection: "row",
		justifyContent: "center",
		marginBottom: 5
	}
})
