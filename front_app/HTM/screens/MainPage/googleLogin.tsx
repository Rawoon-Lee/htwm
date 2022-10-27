import * as React from "react"
import * as WebBrowser from "expo-web-browser"
import { StyleSheet, View, Button, Image, Text } from "react-native"
import * as Google from "expo-auth-session/providers/google"
import { ResponseType } from "expo-auth-session"
import axios from "axios"

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

	React.useEffect(() => {
		if (response?.type === "success") {
			// const { authentication } = response
			setAccessToken(response.authentication?.accessToken)
			console.log(response.authentication)
			console.log(response.authentication?.accessToken)
		}
	}, [response])

	function showUserInfo() {
		if (userInfo) {
			return (
				<View style={styles.userInfo}>
					<Text>구글 로그인하기 위한 버튼</Text>
					<Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
					<Text>Welcome {userInfo.name}</Text>
					<Text>{userInfo.email}</Text>
				</View>
			)
		}
	}
	// async function getUserData() {
	// 	axios
	// 		.get("people.googleapis.com/v1/people/me", {
	// 			headers: { Authorization: `Bearer ${accessToken}` }
	// 		})
	// 		.then(result => {
	// 			console.log(result.data)
	// 			console.log("통괴됨")
	// 		})
	// 		.catch(err => {
	// 			console.log(err)
	// 			console.log("에러남")
	// 		})
	// }
	async function getUserData() {
		let userInfoResponse = await fetch(
			"https://www.googleapis.com/userinfo/v2/me",
			{
				headers: { Authorization: `Bearer ${accessToken}` }
			}
		)

		userInfoResponse.json().then(data => {
			console.log(userInfo)
			setUserInfo(data)
		})
	}
	return (
		<View>
			<Text>test 중입니다</Text>
			{showUserInfo()}
			<Button
				disabled={!request}
				title={accessToken ? "Get User Data" : "Login"}
				onPress={
					accessToken
						? getUserData
						: () => {
								promptAsync({ showInRecents: true })
						  }
				}
			></Button>
			<Button title="Logout" onPress={() => {}}></Button>
		</View>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center"
	},
	userInfo: {
		alignItems: "center",
		justifyContent: "center"
	},
	profilePic: {
		width: 50,
		height: 50
	}
})
export default GoogleLogin
