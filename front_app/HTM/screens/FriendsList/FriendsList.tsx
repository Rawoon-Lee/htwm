import { StyleSheet, Text, View } from "react-native"
import Constants from "expo-constants"
import { TextInput } from "react-native"
import * as React from "react"

import { user } from "../../api/user"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getFriendsList } from "../../store/user"

function FriendsList() {
	const userId = useAppSelector(state => state.userId)
	const frindList = useAppSelector(state => state.friendList)
	const dispatch = useAppDispatch()

	React.useEffect(() => {
		user
			.friendList(userId.id)
			.then(result => {
				console.log(result.data)
				if (result.data) dispatch(getFriendsList(result.data))
			})
			.catch(err => console.log(err))
	}, [])

	return (
		<View style={styles.container}>
			<Text>친구목록</Text>
		</View>
	)
}

export default FriendsList

const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight
	}
})
