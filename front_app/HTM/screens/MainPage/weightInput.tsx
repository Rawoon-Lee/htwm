import { StyleSheet, Text, View, Dimensions, Button } from "react-native"
import * as React from "react"
import { TextInput } from "react-native-gesture-handler"
import { SmallButton } from "../../components/PrimaryButton"

let height = Dimensions.get("screen").height
let width = Dimensions.get("screen").width

export default function WeightInput() {
	const [weightToday, setWeightToday] = React.useState("")
	const [showWeight, setShowWeight] = React.useState(true)
	let click = () => {
		setShowWeight(false)
	}

	return (
		<View>
			{showWeight ? (
				<View style={styles.container}>
					<View style={styles.container1}>
						<TextInput
							style={{ width: width / 10 }}
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
					<Text style={{ fontSize: 12, color: "#727272" }}>오늘의 몸무게</Text>
					<Text style={{ fontSize: 24, color: "#373737" }}> {weightToday}kg</Text>
				</View>
			)}
		</View>
	)
}

let styles = StyleSheet.create({
	container: {
		padding: 5,
		paddingBottom: 15,
		paddingTop: 10,
		alignItems: "center",
		backgroundColor: `rgba(222,87,136,0.2)`,
		borderRadius: 10,
		width: (width * 2) / 7,
		height: height / 10,
		marginLeft: 5
	},
	container1: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 5,
		marginLeft: 5
	},
	container2: {
		paddingBottom: 15,
		paddingTop: 10,
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: `rgba(222,87,136,0.2)`,
		borderRadius: 10,
		width: (width * 2) / 7,
		height: height / 10,
		marginLeft: 5
	}
})
