import * as React from "react"
import * as WebBrowser from "expo-web-browser"
import { StyleSheet, View, Button } from "react-native"
import * as Google from "expo-auth-session/providers/google"

WebBrowser.maybeCompleteAuthSession()

function GoogleLogin() {
	interface UserData {
		accessToken: string
	}
	const [userInfo, setUserInfo] = React.useState()
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
			console.log(response)
		}
	}, [response])

	async function getUserData() {
		// let userInfoResponse = await
	}
	return (
		<Button
			disabled={!request}
			title="Login"
			onPress={() => {
				promptAsync()
			}}
		></Button>
	)
}

export default GoogleLogin
