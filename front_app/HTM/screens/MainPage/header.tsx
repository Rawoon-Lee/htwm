import { StyleSheet, Text, View, Image, Pressable } from "react-native"
import GoogleLogin from "./googleLogin"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import * as React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { user } from "../../api/userAPI"
import { getUserInfo, getUserId } from "../../store/user"

function Header({ navigation }: any) {
	const userInfo = useAppSelector(state => state.userInfo)
	const userId = useAppSelector(state => state.userId)
	const dispatch = useAppDispatch()

	async function retreiveUserData() {
		try {
			const loadedData = await AsyncStorage.getItem("userId")
			if (loadedData) {
				dispatch(getUserId(loadedData))
			}
		} catch (err) {
			console.log(err)
		}
	}

	React.useEffect(() => {
		retreiveUserData()
		if (!userId.id) return
		user
			.getInfo(userId.id)
			.then(result => {
				dispatch(getUserInfo(result.data))
			})
			.catch(err => console.log(err))
	}, [userId.id])

	function moveToEdit() {
		navigation.navigate("ProfileEdit")
	}

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{userInfo.nickname}</Text>
			{userId.id ? (
				<View>
					<Pressable onPress={moveToEdit}>
						<Image source={{ uri: userInfo.url }} style={styles.profilePic} />
					</Pressable>
				</View>
			) : null}
			<GoogleLogin></GoogleLogin>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		elevation: 4,
		padding: 20
	},
	text: {
		fontSize: 40
	},
	profilePic: {
		width: 40,
		height: 40
	}
})

export default Header
