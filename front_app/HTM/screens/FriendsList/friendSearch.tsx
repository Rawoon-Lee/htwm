import { StyleSheet, Text, View, TextInput } from "react-native"
import Constants from "expo-constants"
import * as React from "react"
import { FlatList } from "react-native"

import { user } from "../../api/userAPI"
import { useAppSelector } from "../../store/hook"
import { FriendData } from "../../store/user"

import FriendBox from "./friendBox"

function renderItems({ item }: { item: FriendData }) {
	return (
		<View style={{alignItems:"center"}}>
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
	const userId = useAppSelector(state => state.userId)
	const [input, setInput] = React.useState("")
	const [friendSearchList, setFriendSearchList] = React.useState<
		FriendData[] | []
	>([])

	React.useEffect(() => {
		if (!input) {
			setFriendSearchList([])
			return
		}
		let data = { nickname: input, username: userId.id }
		user
			.friendSearch(data)
			.then(result => {
				setFriendSearchList(result.data)
			})
			.catch(err => console.log(err))
	}, [input])

	return (
		<View style={styles.container}>
			<Text style={{margin: 10}}>친구검색</Text>
			<TextInput
				onChangeText={text => {
					setInput(text)
				}}
				placeholder="닉네임을 입력해주세요"
				style={{
                    backgroundColor: "#d2d2d2",
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
		flex: 1
		// marginTop: Constants.statusBarHeight
	}
})
