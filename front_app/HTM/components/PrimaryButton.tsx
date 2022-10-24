import * as React from "react"
import { StyleSheet, Text, View, Pressable } from "react-native"
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import { Button } from "react-native"

WebBrowser.maybeCompleteAuthSession()

function PrimaryButton({ children }: any) {
	function pressHandler() {
		console.log("눌렀다!")
	}
	const [request, response, promptAsync] = Google.useAuthRequest({
		expoClientId: "GOOGLE_GUID.apps.googleusercontent.com",
		iosClientId: "GOOGLE_GUID.apps.googleusercontent.com",
		androidClientId: "GOOGLE_GUID.apps.googleusercontent.com",
		webClientId: "GOOGLE_GUID.apps.googleusercontent.com"
	})

	React.useEffect(() => {
		if (response?.type === "success") {
			const { authentication } = response
		}
	}, [response])

	return (
		<View style={styles.outerContainer}>
			<Pressable
				style={styles.innerContainer}
				onPress={pressHandler}
				android_ripple={{ color: "yellow" }}
			>
				<Text style={styles.textStyle}>{children}</Text>
			</Pressable>
		</View>
	)
}

export default PrimaryButton

const styles = StyleSheet.create({
	outerContainer: {
		borderRadius: 18,
		margin: 10,
		overflow: "hidden"
	},
	innerContainer: {
		padding: 16,
		backgroundColor: "grey",
		elevation: 4
	},
	textStyle: {
		color: "white",
		fontSize: 20,
		textAlign: "center"
	}
})
