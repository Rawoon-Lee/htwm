import * as React from "react"
import * as WebBrowser from "expo-web-browser"
import { StyleSheet, View, Pressable, Image, Text } from "react-native"
import * as Google from "expo-auth-session/providers/google"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { user } from "../../api/user"

WebBrowser.maybeCompleteAuthSession()

function GoogleLogin() {
	interface UserData {
		accessToken: string
	}
	const [userInfo, setUserInfo] = React.useState<any | null>(null)
	// any할거면 interface 왜 만드나
	const [accessToken, setAccessToken] = React.useState<any | null>(null)

	const [request, response, promptAsync] = Google.useAuthRequest({
		expoClientId:
			"440495779704-ekaoouogu6bnahpkh5qka267linn8f2d.apps.googleusercontent.com",
		androidClientId:
			"440495779704-3367tl8q0m2rctutebc91ksvbt6t0dho.apps.googleusercontent.com",
		iosClientId:
			"440495779704-5uftm1ea7girg4j5v78cbdrjq2lcuoe7.apps.googleusercontent.com"
	})

	async function storeUserData() {
		try {
			const userId = userInfo.email.split("@")[0]
			await AsyncStorage.setItem("userId", userId)
		} catch (err) {
			console.log(err)
		}
	}
	async function retreiveUserData() {
		try {
			const loadedData = await AsyncStorage.getItem("userId")
			// console.log(loadedData)
		} catch (err) {
			console.log(err)
		}
	}

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
		if (!userInfo) return
		let data = {
			nickname: userInfo.name,
			url: userInfo.picture,
			username: userInfo.email.split("@")[0]
		}
		user
			.login(data)
			.then(result => {
				console.log(result.data)
				console.log("성공함")
			})
			.catch(err => {
				console.log(err)
				console.log("실패함")
			})
	}, [userInfo])

	function showUserInfo() {
		if (userInfo) {
			return (
				<View style={styles.userInfo}>
					<Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
					<Text>Welcome {userInfo.name}</Text>
					<Text>{userInfo.email}</Text>
				</View>
			)
		}
	}

	async function getUserData() {
		let userInfoResponse = await fetch(
			"https://www.googleapis.com/userinfo/v2/me",
			{
				headers: { Authorization: `Bearer ${accessToken}` }
			}
		)

		await userInfoResponse.json().then(data => {
			// console.log(userInfo)
			setUserInfo(data)
		})

		storeUserData()
		retreiveUserData()
	}

	function logout() {
		AsyncStorage.removeItem("userId")
	}
	return (
		<View>
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
				<Image
					source={require("../../assets/g-logo.png")}
					style={styles.profilePic}
				/>
				<Text>{accessToken ? "Get User Data" : "구글 로그인"}</Text>
			</Pressable>
			{accessToken ? (
				<>
					{showUserInfo()}
					<Pressable onPress={logout}>
						<Text>로그아웃</Text>
					</Pressable>
				</>
			) : null}
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
