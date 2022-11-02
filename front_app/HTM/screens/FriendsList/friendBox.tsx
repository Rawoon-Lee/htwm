import { StyleSheet, Pressable, View, Text, Image } from "react-native"
import * as React from "react"

import { FriendData } from "../../store/user"

import { notice } from "../../api/noticeAPI"
import { useAppSelector } from "../../store/hook"

export default function FriendBox({
	username,
	nickname,
	url,
	isSearch
}: FriendData) {
	const userId = useAppSelector(state => state.userId)
	function friendRequest() {
		let data = { friendname: username, username: userId.id }
		notice
			.requestFriend(data)
			.then(reuslt => {
				console.log(reuslt.data)
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
				<Pressable onPress={() => friendRequest()}>
					<Text>친구 신청</Text>
				</Pressable>
			) : (
				<View>
					<Pressable onPress={() => friendRequest()}>
						<Text>삭제</Text>
					</Pressable>
					<Pressable onPress={() => friendRequest()}>
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
	}
})
