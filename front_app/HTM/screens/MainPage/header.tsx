import { StyleSheet, Text, View } from "react-native"
import GoogleLogin from "./googleLogin"
import { useNavigation } from "@react-navigation/native"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import * as React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { user } from "../../api/userAPI"
import { getUserInfo } from "../../store/user"

function Header() {
	const navigation = useNavigation()
	const userInfo = useAppSelector(state => state.userInfo)
	const dispatch = useAppDispatch()

	const [userEmail, setUserEmail] = React.useState<string | null>(null)

	async function retreiveUserData() {
		try {
			setUserEmail(await AsyncStorage.getItem("userId"))
			// console.log(loadedData)
		} catch (err) {
			console.log(err)
		}
	}

	React.useEffect(() => {
		retreiveUserData()
		if (!userEmail) return
		user
			.getInfo(userEmail)
			.then(result => {
				// console.log(result.data)
				dispatch(getUserInfo(result.data))
			})
			.catch(err => console.log(err))
	}, [userEmail])

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Hello {userInfo.nickname}</Text>
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
	}
})

export default Header
