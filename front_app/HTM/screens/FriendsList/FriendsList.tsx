import { StyleSheet, Text, View, Pressable, FlatList, ScrollView, Dimensions } from "react-native"
import Constants from "expo-constants"
import * as React from "react"

import { user } from "../../api/userAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getFriendsList, initFriendList } from "../../store/user"

import FriendBox from "./friendBox"
import { FriendData } from "../../store/user"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

function renderItems({ item }: { item: FriendData }) {
	return (
		<FriendBox nickname={item.nickname} username={item.username} url={item.url} isSearch={false} />
	)
}
function FriendsList({ navigation }: any) {
	const userId = useAppSelector(state => state.userId)
	const friendList = useAppSelector(state => state.friendList)
	const dispatch = useAppDispatch()

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

	function moveToSearch() {
		navigation.navigate("FriendSearch")
	}
	return (
		<View style={styles.container}>
			<View
				style={{
					width: width,
				}}
			>
				<Text
					style={{
						fontSize: 30,
						paddingBottom: 5,
						paddingLeft: 20
					}}
				>
					친구 목록
				</Text>

			</View>
			<View style={{ width: width, alignItems: "flex-end" }}>
				<Pressable style={styles.button} onPress={moveToSearch}>
					<Text>친구추가</Text>
				</Pressable>
			</View>
			{friendList.length >= 1 ? (
				<FlatList
					data={friendList}
					keyExtractor={item => item.username}
					renderItem={renderItems}
				></FlatList>
			) : (
				<Text>아직 친구가 없군요</Text>
			)}

		</View>
	)
}

export default FriendsList

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		marginTop: Constants.statusBarHeight
	},
	button: {
		borderRadius: 13,
		borderColor: "black",
		margin: 10,
		overflow: "hidden",
		borderStyle: "solid",
		borderWidth: 1,
		paddingHorizontal: 15,
		paddingVertical: 4,
		backgroundColor: "#FAFAFA"
	},
})
