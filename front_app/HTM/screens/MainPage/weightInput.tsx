import { StyleSheet, Text, View, Dimensions, Button } from "react-native"
import * as React from "react"
import { TextInput } from "react-native-gesture-handler"

import { SmallButton } from "../../components/PrimaryButton"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

export default function WeightInput() {
	const [weightToday, setWeightToday] = React.useState("")
	const [showWeight, setShowWeight] = React.useState(true)
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
	}, [])
	let click = () => {
		setShowWeight(false)
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
		<View onLayout={onLayoutRootView}>
			{showWeight ? (
				<View style={styles.container}>
					<View style={styles.container1}>
						<TextInput
							style={{
								textAlign: "center",
								width: width / 4,
								fontFamily: "line-rg",
								fontSize: 20
							}}
							keyboardType={"numeric"}
							onChangeText={text => {
								setWeightToday(text)
							}}
							placeholder="몸무게"
						></TextInput>
						<Text> kg</Text>
					</View>
					<View style={{ width: (width * 2) / 10 }}>
						<SmallButton
							children={"입력"}
							clickFunction={click}
							color={"white"}
							borderColor={"white"}
						/>
					</View>
				</View>
			) : (
				<View style={styles.container2}>
					<Text style={{ fontSize: 15, color: "#727272" }}>오늘의 몸무게</Text>
					<Text style={{ fontSize: 24, color: "#373737" }}> {weightToday}kg</Text>
				</View>
			)}
		</View>
	)
}

let styles = StyleSheet.create({
	container: {
		padding: 10,
		alignItems: "center",
		backgroundColor: `rgba(222,87,136,0.2)`,
		borderRadius: 10,
		width: width / 2.5,
		height: height / 9,
		marginLeft: 5
	},
	container1: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 10
	},
	container2: {
		paddingBottom: 15,
		paddingTop: 10,
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: `rgba(222,87,136,0.2)`,
		borderRadius: 10,
		width: width / 2.5,
		height: height / 9,
		marginLeft: 5
	}
})
