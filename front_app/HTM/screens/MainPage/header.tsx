import { StyleSheet, Text, View, Image, Pressable } from "react-native"
import GoogleLogin from "./googleLogin"
import { useNavigation } from "@react-navigation/native"
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
				// console.log(result.data)
				dispatch(getUserInfo(result.data))
			})
			.catch(err => console.log(err))
	}, [userInfo.nickname])

	function moveToEdit() {
		navigation.navigate("ProfileEdit")
	}

	// console.log(userId.id)
	// console.log(userInfo)
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Hello {userInfo.nickname}</Text>
			{userInfo.url ? (
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
		width: 20,
		height: 20,
		marginRight: 12
	}
})

export default Header
