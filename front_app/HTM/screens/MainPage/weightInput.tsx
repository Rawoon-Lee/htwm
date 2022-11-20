import { StyleSheet, Text, View, Dimensions, Button } from "react-native"
import * as React from "react"
import { TextInput } from "react-native-gesture-handler"

import { SmallButton } from "../../components/PrimaryButton"

import { user } from "../../api/userAPI"
import { useAppSelector } from "../../store/hook"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

export default function WeightInput() {
	const userId = useAppSelector(state => state.userId)
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
	function updateWeight(weight: number) {
		if (!weight || weight === 0) {
			alert("몸무게를 정확히 입력해주세요")
			return
		}
		let data = {
			username: userId.id,
			weight: weight
		}

		user
			.weightRecord(data)
			.then(res => {
				setShowWeight(!showWeight)
			})
			.catch(err => {
				console.log(err.response.data)
			})
	}
	let click = () => {
		setShowWeight(!showWeight)
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
								width: width / 5,
								fontFamily: "line-rg",
								fontSize: 20
							}}
							keyboardType={"numeric"}
							onChangeText={text => {
								setWeightToday(text)
							}}
							placeholder="몸무게"
						></TextInput>
						<Text style={{ fontFamily: "line-rg", fontSize: 20 }}> kg</Text>
					</View>
					<View style={{ width: (width * 2) / 12 }}>
						<SmallButton
							children={"입력"}
							clickFunction={() => updateWeight(parseInt(weightToday))}
							color={"white"}
							borderColor={"white"}
						/>
					</View>
				</View>
			) : (
				<View style={styles.container2}>
					<Text
						style={{ fontSize: 20, color: "#727272", fontFamily: "line-rg", marginVertical: 5 }}
					>
						오늘의 몸무게
					</Text>
					<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
						<Text
							style={{
								fontSize: 22,
								color: "#373737",
								fontFamily: "line-bd",
								marginVertical: 5,
								marginRight: 7
							}}
						>
							{weightToday}kg
						</Text>
						<View style={{ width: (width * 2) / 12 }}>
							<SmallButton
								children={"수정"}
								clickFunction={click}
								color={"white"}
								borderColor={"white"}
							/>
						</View>
					</View>
				</View>
			)}
		</View>
	)
}

let styles = StyleSheet.create({
	container: {
		padding: 10,
		alignItems: "center",
		backgroundColor: `#6da0ff33`,
		borderRadius: 10,
		width: width / 2.5,
		height: height / 9,
		margin: 10
	},
	container1: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 2
	},
	container2: {
		paddingBottom: 15,
		paddingTop: 10,
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: `#6da0ff33`,
		borderRadius: 10,
		width: width / 2.5,
		height: height / 9,
		margin: 10
	}
})
