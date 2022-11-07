import { StyleSheet, Text, View, Image, Pressable } from "react-native"
import { StatusBar } from "expo-status-bar"
import Constants from "expo-constants"
import GoogleLogin from "./googleLogin"
import DeviceIntro from "./deviceIntro"
import ExerciseDays from "./exerciseDays"
import WeightGraph from "./weightGraph"
import WeightInput from "./weightInput"
import Header from "./header"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { user } from "../../api/userAPI"
import { getUserInfo } from "../../store/user"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import * as React from "react"

import TrainingBird from "./trainingBird"

function Main({ navigation }: any) {
	// const userInfo = useAppSelector(state => state.userInfo)
	// const dispatch = useAppDispatch()

	// const [userEmail, setUserEmail] = React.useState<string | null>(null)

	// async function retreiveUserData() {
	// 	try {
	// 		setUserEmail(await AsyncStorage.getItem("userId"))
	// 		// console.log(loadedData)
	// 	} catch (err) {
	// 		console.log(err)
	// 	}
	// }

	// React.useEffect(() => {
	// 	retreiveUserData()
	// 	if (!userEmail) return
	// 	user
	// 		.getInfo(userEmail)
	// 		.then(result => {
	// 			// console.log(result.data)
	// 			dispatch(getUserInfo(result.data))
	// 		})
	// 		.catch(err => console.log(err))
	// }, [])

	// function moveToMyPage() {
	// 	navigation.navigate("ProfileEdit")
	// }

	return (
		<View style={styles.container}>
			{/* <View>
				<Text style={styles.text}>Hello {userInfo.nickname}</Text>
				<Pressable onPress={moveToMyPage}>
					<Image source={{ uri: userInfo.url }} style={styles.profilePic} />
				</Pressable>
				<GoogleLogin></GoogleLogin>
			</View> */}
			<Header navigation={navigation}></Header>
			<ExerciseDays></ExerciseDays>
			<WeightInput></WeightInput>
			<StatusBar style="auto" />
			<Header></Header>
			<TrainingBird></TrainingBird>
			<View style={{ flexDirection: "row", marginTop: 10 }}>
				<ExerciseDays></ExerciseDays>
				<WeightInput></WeightInput>
			</View>
			<WeightGraph></WeightGraph>
			<View style={{ backgroundColor: "#D9D9D9", borderRadius: 20 }}>
				<DeviceIntro></DeviceIntro>
			</View>
		</View>
	)
}

export default Main

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		marginTop: Constants.statusBarHeight
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
