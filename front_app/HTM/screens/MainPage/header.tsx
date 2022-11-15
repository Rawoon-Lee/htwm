import { StyleSheet, Text, View, Image, Pressable } from "react-native"
import GoogleLogin from "./googleLogin"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import * as React from "react"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

import AsyncStorage from "@react-native-async-storage/async-storage"

import { user } from "../../api/userAPI"
import { getUserInfo, getUserId } from "../../store/user"

function Header({ navigation }: any) {
	const userInfo = useAppSelector(state => state.userInfo)
	const userId = useAppSelector(state => state.userId)

	const [fontsLoaded] = useFonts({
		"line-rg": require("../../assets/fonts/LINESeedKR-Rg.ttf")
	})

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
		// 폰트 불러오기
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
	}, [])

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
	const onLayoutRootView = React.useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync()
		}
	}, [fontsLoaded])

	if (!fontsLoaded) {
		return null
	}
	return (
		<View style={styles.container} onLayout={onLayoutRootView}>
			{userId.id ? (
				<View style={styles.profile}>
					<Pressable onPress={moveToEdit} style={{ marginRight: 10 }}>
						<Image source={{ uri: userInfo.url }} style={styles.profilePic} />
					</Pressable>
					<Text style={styles.text}>{userInfo.nickname}</Text>
				</View>
			) : null}
			<GoogleLogin></GoogleLogin>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		elevation: 4
	},
	text: {
		fontSize: 30,
		fontFamily: "line-rg"
	},
	profilePic: {
		width: 40,
		height: 40,
		borderRadius: 30
	},
	profile: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end"
	}
})

export default Header
