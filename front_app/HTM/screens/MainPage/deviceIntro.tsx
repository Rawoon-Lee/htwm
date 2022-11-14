import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native"
import { BigButton } from "../../components/PrimaryButton"
import * as React from "react"

import { user } from "../../api/userAPI"
import { useAppSelector, useAppDispatch } from "../../store/hook"
import { getUserUuid } from "../../store/user"
let width = Dimensions.get("screen").width

function DeviceIntro({ navigation }: any) {
	const dispatch = useAppDispatch()
	const userId = useAppSelector(state => state.userId)

	React.useEffect(() => {
		user
			.getUuid({ username: userId.id })
			.then(result => {
				console.log(result.data)
				dispatch(getUserUuid(result.data))
			})
			.catch(err => {
				console.log(err)

				if (err.response.status === 400) {
					console.log("어쩔 수 없지")
				}
			})
	}, [])

	function moveToEdit() {
		navigation.navigate("ProfileEdit")
	}
	return (
		<View style={[styles.container, { backgroundColor: "#D9D9D9", borderRadius: 20 }]}>
			<Text style={styles.text}>거울을 연결하여 사용하세요</Text>
			<View style={{ width: (width * 1) / 2 }}>
				<BigButton children={"거울 연결하기"} clickFunction={moveToEdit}></BigButton>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		elevation: 4,
		padding: 20
	},
	text: {
		fontSize: 15,
		color: "#373737"
	}
})

export default DeviceIntro
