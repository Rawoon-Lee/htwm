import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native"
import { BigButton } from "../../components/PrimaryButton"
import * as React from "react"

import { user } from "../../api/userAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getUserUuid } from "../../store/user"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
let width = Dimensions.get("screen").width

function DeviceIntro({ navigation }: any) {
	const dispatch = useAppDispatch()
	const userId = useAppSelector(state => state.userId)
	const [fontsLoaded] = useFonts({
		"line-rg": require("../../assets/fonts/LINESeedKR-Rg.ttf"),
		"line-bd": require("../../assets/fonts/LINESeedKR-Bd.ttf")
	})

	React.useEffect(() => {
		// 폰트 불러오기
		async function prepare() {
			await SplashScreen.preventAutoHideAsync()
		}
		prepare()
		user
			.getUuid({ username: userId.id })
			.then(result => {
				dispatch(getUserUuid(result.data))
			})
			.catch(err => {
				console.log(err)
			})
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
		<View style={[styles.container]}>
			<Text style={styles.text}>🪞 거울을 연결하여 사용하세요</Text>
			<View>
				<BigButton children={"거울 연결하기"} clickFunction={moveToEdit}></BigButton>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
		marginTop: 10
	},
	text: {
		fontSize: 25,
		color: "#373737",
		fontFamily: "line-bd"
	}
})

export default DeviceIntro
