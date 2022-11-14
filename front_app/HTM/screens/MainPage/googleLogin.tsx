import * as React from "react"
import * as WebBrowser from "expo-web-browser"
import { StyleSheet, View, Pressable, Image, Text } from "react-native"
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { user } from "../../api/userAPI"
import { getUserId, getUserInfo, initUserId } from "../../store/user"
import { useAppSelector, useAppDispatch } from "../../store/hook"

WebBrowser.maybeCompleteAuthSession()

function GoogleLogin() {
	interface UserData {
		email: string
		given_name: string
		id: string
		locale: string
		name: string
		picture: string
		verified_email: boolean
	}
	const dispatch = useAppDispatch()
	const userId = useAppSelector(state => state.userId)
	const [userInfo, setUserInfo] = React.useState<UserData | null>(null)
	// any할거면 interface 왜 만드나
	const [accessToken, setAccessToken] = React.useState<any | null>(null)

	const [request, response, promptAsync] = Google.useAuthRequest({
		androidClientId: "440495779704-3367tl8q0m2rctutebc91ksvbt6t0dho.apps.googleusercontent.com",
		iosClientId: "440495779704-5uftm1ea7girg4j5v78cbdrjq2lcuoe7.apps.googleusercontent.com",
		expoClientId: "440495779704-ekaoouogu6bnahpkh5qka267linn8f2d.apps.googleusercontent.com"
	})

	async function storeUserData() {
		if (!userInfo || typeof userInfo.email === "undefined") return
		try {
			const userId = userInfo.email.split("@")[0]
			await AsyncStorage.setItem("userId", userId)
			dispatch(getUserId(userId))
		} catch (err) {
			console.log(err)
		}
	}
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
		if (!userInfo || typeof userInfo.email === "undefined") return
		let data = {
			nickname: userInfo.name,
			url: userInfo.picture,
			username: userInfo.email.split("@")[0]
		}
		dispatch(getUserId(data.username))
		user
			.getInfo(data.username)
			.then(result => {
				console.log("데이터 가져와서 저장하기 시작")
				dispatch(getUserInfo(result.data))
			})
			.catch(err => {
				console.log("에러나서 가져오기 못함 ㅠ")
				console.log(err)
			})
	}, [])

	React.useEffect(() => {
		if (response?.type === "success") {
			// const { authentication } = response
			setAccessToken(response.authentication?.accessToken)
			// console.log(response.authentication)
			// console.log(response.authentication?.accessToken)
		}
		getUserData()
	}, [response])

	React.useEffect(() => {
		if (!userInfo || typeof userInfo.email === "undefined") return
		let data = {
			nickname: userInfo.name,
			url: userInfo.picture,
			username: userInfo.email.split("@")[0]
		}
		dispatch(getUserId(data.username))
		user
			.login(data)
			.then(result => {
				console.log(result.data)
				console.log("성공함")
				user
					.getInfo(data.username)
					.then(result => {
						console.log("데이터 가져와서 저장하기 시작")
						dispatch(getUserInfo(result.data))
					})
					.catch(err => {
						console.log("에러나서 가져오기 못함 ㅠ")
						console.log(err)
					})
			})
			.catch(err => {
				console.log(err)
				console.log("실패함")
			})
	}, [userInfo])

	React.useEffect(() => {
		if (!accessToken) return
		getUserData()
	}, [accessToken])

	async function getUserData() {
		let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
			headers: { Authorization: `Bearer ${accessToken}` }
		})

		await userInfoResponse.json().then(data => {
			// console.log(userInfo)
			setUserInfo(data)
		})

		await storeUserData()
		// // retreiveUserData()
	}

	function logout() {
		console.log("로그아웃 ㄱㄱ")
		AsyncStorage.removeItem("userId")
		let data = {
			nickname: "",
			url: "",
			height: 0
		}
		dispatch(getUserInfo(data))
		dispatch(initUserId())
		console.log("왜 안바뀜?", userId.id)
		console.log("유저정보 파기됐나?", userInfo)
	}

	return (
		<View>
			{userId.id ? (
				<Pressable onPress={logout}>
					<Text>로그아웃</Text>
				</Pressable>
			) : (
				<Pressable
					style={styles.container}
					disabled={!request}
					onPress={
						accessToken
							? getUserData
							: () => {
									promptAsync({ showInRecents: true })
							  }
					}
				>
					<Image source={require("../../assets/g-logo.png")} style={styles.profilePic} />
					<Text>구글 로그인</Text>
				</Pressable>
			)}
			{/* {userId ? (
				<>
					{showUserInfo()}
					<Pressable onPress={logout}>
						<Text>로그아웃</Text>
					</Pressable>
				</>
			) : null} */}
		</View>
	)
}
const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		elevation: 4,
		padding: 10,
		borderRadius: 10
	},
	userInfo: {
		alignItems: "center",
		justifyContent: "center"
	},
	profilePic: {
		width: 20,
		height: 20,
		marginRight: 12
	}
})
export default GoogleLogin
