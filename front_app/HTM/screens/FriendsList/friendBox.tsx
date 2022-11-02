import { StyleSheet, Pressable, View, Text, Image } from "react-native"
import * as React from "react"

import { FriendData } from "../../store/user"

import { notice } from "../../api/noticeAPI"
import { user } from "../../api/userAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getFriendsList } from "../../store/user"

import { Feather } from "@expo/vector-icons"

export default function FriendBox({
	username,
	nickname,
	url,
	status,
	isSearch
}: FriendData) {
	function Button0() {
		return (
			<View style={styles.button0}>
				<Pressable onPress={() => friendRequest()}>
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
				<Pressable onPress={() => friendConsent()}>
					<Text>친구 수락</Text>
				</Pressable>
			</View>
		)
	}

	const buttons = [Button0(), Button1(), Button2(), Button3()]
	const userId = useAppSelector(state => state.userId)
	const dispatch = useAppDispatch()

	function updateFriendList() {
		user
			.friendList(userId.id)
			.then(result => {
				dispatch(getFriendsList(result.data))
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
				updateFriendList()
			})
			.catch(err => {
				console.log(err)
				console.log("실패함")
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

	return (
		<View>
			<Text>{username}</Text>
			<Text>{nickname}</Text>
			<Image source={{ uri: url }} style={styles.profilePic} />
			{isSearch ? (
				<>{buttons[Number(status)]}</>
			) : (
				<View>
					<Pressable onPress={friendDelete}>
						<Text>삭제</Text>
					</Pressable>
					<Pressable
						onPress={() => {
							console.log("같이 플레이하자")
						}}
					>
						<Text>플레이</Text>
					</Pressable>
				</View>
			)}
		</View>
	)
}
const styles = StyleSheet.create({
	profilePic: {
		width: 20,
		height: 20,
		marginRight: 12
	},
	button0: {
		borderWidth: 4,
		borderColor: "red",
		borderRadius: 10
	},
	button1: {
		borderWidth: 4,
		borderColor: "grey",
		borderRadius: 10
	},
	button2: {
		borderWidth: 4,
		borderColor: "grey",
		borderRadius: 10
	},
	button3: {
		borderWidth: 4,
		borderColor: "green",
		borderRadius: 10,
		justifyContent: "center",
		width: 100,
		height: 30
	}
})
