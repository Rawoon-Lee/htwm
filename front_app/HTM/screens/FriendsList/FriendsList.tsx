import { StyleSheet, Text, View, Pressable } from "react-native"
import Constants from "expo-constants"
import { TextInput } from "react-native"
import * as React from "react"
import { FlatList } from "react-native"

import { user } from "../../api/userAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getFriendsList } from "../../store/user"

import FriendBox from "./friendBox"
import { FriendData } from "./friendSearch"

function renderItems({ item }: { item: FriendData }) {
	return (
		<FriendBox
			nickname={item.nickname}
			username={item.username}
			url={item.url}
			isSearch={false}
		/>
	)
}
function FriendsList({ navigation }: any) {
	const userId = useAppSelector(state => state.userId)
	const friendList = useAppSelector(state => state.friendList)
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		user
			.friendList(userId.id)
			.then(result => {
				dispatch(getFriendsList(result.data))
			})
			.catch(err => console.log(err))
	}, [])
	function moveToSearch() {
		navigation.navigate("FriendSearch")
	}
	return (
		<View style={styles.container}>
			<Text>친구목록</Text>
			<View>
				<Pressable onPress={moveToSearch}>
					<Text>친구추가</Text>
				</Pressable>
			</View>
			{friendList ? (
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
		marginTop: Constants.statusBarHeight
	}
})
