import { StyleSheet, Pressable, View, Text, Image, Dimensions } from "react-native"
import * as React from "react"

import { FriendData } from "../../store/user"

import { notice } from "../../api/noticeAPI"
import { user } from "../../api/userAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getFriendsList, getFriendsSearchList } from "../../store/user"

import { Feather } from "@expo/vector-icons"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { color } from "../../Style/commonStyle"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

export default function FriendBox({ username, nickname, url, status, isSearch }: FriendData) {
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

	function Button0() {
		return (
			<View style={styles.button0}>
				<Pressable
					onPress={() => {
						friendRequest()
						updateFriendList()
					}}
				>
					<Text style={{ fontFamily: "line-bd", fontSize: 15, color: "#fff" }}>친구 신청</Text>
				</Pressable>
			</View>
		)
	}
	function Button1() {
		return (
			<View style={styles.button1}>
				<Pressable disabled={true}>
					<Text style={{ fontFamily: "line-bd", fontSize: 18 }}>🟢{`  `}친구</Text>
				</Pressable>
			</View>
		)
	}
	function Button2() {
		return (
			<View style={styles.button2}>
				<Pressable disabled={true}>
					<Text style={{ fontFamily: "line-bd", fontSize: 15, color: "grey" }}>친구 신청</Text>
				</Pressable>
			</View>
		)
	}
	function Button3() {
		return (
			<View style={styles.button3}>
				<Pressable
					onPress={() => {
						friendConsent()
						updateFriendList()
					}}
				>
					<Text style={{ fontFamily: "line-bd", fontSize: 15, color: "#fff" }}>친구 수락</Text>
				</Pressable>
			</View>
		)
	}

	const buttons = [Button0(), Button1(), Button2(), Button3()]
	const userId = useAppSelector(state => state.userId)
	const input = useAppSelector(state => state.searchInput)
	const dispatch = useAppDispatch()

	function updateFriendList() {
		let data = { nickname: input, username: userId.id }
		user
			.friendList(userId.id)
			.then(result => {
				dispatch(getFriendsList(result.data))
				user
					.friendSearch(data)
					.then(result => {
						dispatch(getFriendsSearchList(result.data))
					})
					.catch(err => console.log(err))
			})
			.catch(err => console.log(err))
	}

	function friendConsent() {
		let data = { friendname: username, username: userId.id }
		user
			.friendAdd(data)
			.then(result => {
				updateFriendList()
			})
			.catch(err => console.log(err))
	}
	function friendRequest() {
		let data = { friendname: username, username: userId.id }
		notice
			.requestFriend(data)
			.then(reuslt => {
				updateFriendList()
			})
			.catch(err => {
				console.log(err)
				alert("예기치 못한 이유로 친구 신청이 실패했습니다.")
			})
	}

	function friendDelete() {
		let data = { friendname: username, username: userId.id }
		user
			.friendDelete(data)
			.then(reuslt => {
				updateFriendList()
			})
			.catch(err => {
				console.log(err)
			})
	}

	function streamingRequest() {
		let data = { friendname: username, username: userId.id }
		notice
			.requestStreaming(data)
			.then(result => {
				alert("스트리밍 신청 완료!")
			})
			.catch(err => {
				alert("예기치 못한 이유로 스트리밍 신청이 실패했습니다.")
				console.log(err)
			})
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
		<View style={styles.buttonContainer} onLayout={onLayoutRootView}>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<Image source={{ uri: url }} style={styles.profilePic} />
				<Text style={{ fontSize: 20, fontFamily: "line-bd" }}>{nickname}</Text>
			</View>
			{isSearch ? (
				<View>{buttons[Number(status)]}</View>
			) : (
				<View style={{ flexDirection: "row", backgroundColor: "#fff" }}>
					<Pressable onPress={streamingRequest} style={styles.playButton}>
						<Text
							style={{
								color: "white",
								textAlign: "center",
								fontFamily: "line-bd",
								fontSize: 15
							}}
						>
							플레이
						</Text>
					</Pressable>
					<Pressable onPress={friendDelete} style={styles.deleteButton}>
						<Text
							style={{
								color: color.danger,
								textAlign: "center",
								fontFamily: "line-bd",
								fontSize: 15
							}}
						>
							삭제
						</Text>
					</Pressable>
				</View>
			)}
		</View>
	)
}
const styles = StyleSheet.create({
	profilePic: {
		width: height / 17,
		height: height / 17,
		borderRadius: 30,
		marginRight: 12
	},
	button0: {
		borderRadius: 7,
		backgroundColor: "lightgreen",
		margin: 5,
		paddingHorizontal: 12,
		paddingVertical: 10
	},
	button1: {
		// borderWidth: 4,
		// borderColor: "grey",
		// borderRadius: 10
		margin: 5
	},
	button2: {
		borderRadius: 7,
		backgroundColor: color.textInputGrey,
		margin: 5,
		paddingHorizontal: 12,
		paddingVertical: 10
	},
	button3: {
		borderRadius: 7,
		backgroundColor: "lightgreen",
		margin: 5,
		paddingHorizontal: 12,
		paddingVertical: 10
	},
	playButton: {
		backgroundColor: "skyblue",
		borderWidth: 2,
		borderColor: "skyblue",
		borderRadius: 7,
		marginLeft: 10,
		paddingHorizontal: 10,
		paddingVertical: 5
	},
	deleteButton: {
		backgroundColor: "#fff",
		borderWidth: 2,
		borderColor: color.textInputGrey,
		borderRadius: 7,
		marginLeft: 10,
		paddingHorizontal: 10,
		paddingVertical: 5
	},
	buttonContainer: {
		borderRadius: 15,
		width: (width * 9) / 10,
		height: height / 12,
		elevation: 4,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 5,
		marginHorizontal: 2,
		paddingHorizontal: 10,
		backgroundColor: "#fff"
	}
})
