import { Text, View, Image, StyleSheet, Pressable } from "react-native"
import { useAppSelector } from "../../store/hook"

function MyPage({ navigation }: any) {
	const userInfo = useAppSelector(state => state.userInfo)
	function moveToEdit() {
		navigation.navigate("ProfileEdit")
	}
	return (
		<View>
			<Text>프로필 사진</Text>
			<Image source={{ uri: userInfo.url }} style={styles.profilePic} />

			<Pressable onPress={moveToEdit}>
				<Text>회원정보 수정</Text>
			</Pressable>
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
	},
	profilePic: {
		width: 20,
		height: 20,
		marginRight: 12
	}
})

export default MyPage
