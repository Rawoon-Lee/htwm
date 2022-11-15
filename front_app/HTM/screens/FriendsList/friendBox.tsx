import { StyleSheet, Pressable, View, Text, Image, Dimensions } from "react-native"
import * as React from "react"

import { FriendData } from "../../store/user"

import { notice } from "../../api/noticeAPI"
import { user } from "../../api/userAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getFriendsList, getFriendsSearchList } from "../../store/user"

import { Feather } from "@expo/vector-icons"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

export default function FriendBox({ username, nickname, url, status, isSearch }: FriendData) {
	function Button0() {
		return (
			<View style={styles.button0}>
				<Pressable
					onPress={() => {
						friendRequest()
						updateFriendList()
					}}
				>
					<Text>친구 신청</Text>
				</Pressable>
			</View>
		)
	}
	function Button1() {
		return (
			<View style={styles.button1}>
				<Pressable disabled={true}>
					<Feather name="check-circle" size={24} color="black" />
				</Pressable>
			</View>
		)
	}
	function Button2() {
		return (
			<View style={styles.button2}>
				<Pressable disabled={true}>
					<Text>친구 신청</Text>
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
					<Text>친구 수락</Text>
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
				console.log(result.data)
				updateFriendList()
			})
			.catch(err => console.log(err))
	}
	function friendRequest() {
		let data = { friendname: username, username: userId.id }
		notice
			.requestFriend(data)
			.then(reuslt => {
				console.log(reuslt.data)
				console.log("친구신청함")

				updateFriendList()
			})
			.catch(err => {
				console.log(err)
				console.log("실패함")
				alert("예기치 못한 이유로 친구 신청이 실패했습니다.")
			})
	}

	function friendDelete() {
		let data = { friendname: username, username: userId.id }
		user
			.friendDelete(data)
			.then(reuslt => {
				console.log(reuslt.data)
				updateFriendList()
			})
			.catch(err => {
				console.log(err)
				console.log("실패함")
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

	return (
		<View style={styles.buttonContainer}>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<Image source={{ uri: url }} style={styles.profilePic} />
				<Text style={{ fontSize: 15 }}>{nickname}</Text>
			</View>
			{isSearch ? (
				<View>{buttons[Number(status)]}</View>
			) : (
				<View style={{ flexDirection: "row" }}>
					<Pressable onPress={streamingRequest} style={styles.playButton}>
						<Text>플레이</Text>
					</Pressable>
					<Pressable onPress={friendDelete} style={styles.deleteButton}>
						<Text>삭제</Text>
					</Pressable>
				</View>
			)}
		</View>
	)
}
const styles = StyleSheet.create({
	profilePic: {
		width: height / 15,
		height: height / 15,
		borderRadius: 30,
		marginRight: 12
	},
	button0: {
		borderRadius: 10,
		backgroundColor: "skyblue",
		margin: 5,
		paddingHorizontal: 10,
		paddingVertical: 4
	},
	button1: {
		borderWidth: 4,
		borderColor: "grey",
		borderRadius: 10
	},
	button2: {
		borderRadius: 10,
		backgroundColor: "grey",
		margin: 5,
		paddingHorizontal: 10,
		paddingVertical: 4
	},
	button3: {
		borderRadius: 10,
		backgroundColor: "lightgreen",
		margin: 5,
		paddingHorizontal: 10,
		paddingVertical: 4
	},
	playButton: {
		borderRadius: 10,
		backgroundColor: "skyblue",
		margin: 5,
		paddingHorizontal: 10,
		paddingVertical: 4
	},
	deleteButton: {
		borderRadius: 10,
		backgroundColor: "pink",
		margin: 5,
		paddingHorizontal: 10,
		paddingVertical: 4
	},
	buttonContainer: {
		borderRadius: 10,
		width: (width * 9) / 10,
		height: height / 12,
		borderWidth: 1,
		borderColor: "grey",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 5,
		paddingHorizontal: 10
	}
})
