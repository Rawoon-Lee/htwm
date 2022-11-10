import { Text, View, Image, StyleSheet, TextInput, Pressable } from "react-native"
import * as React from "react"
import * as ImagePicker from "expo-image-picker"

import { useAppSelector, useAppDispatch } from "../../store/hook"
import { user } from "../../api/userAPI"
import { picture } from "../../api/pictureAPI"
import { getUserInfo } from "../../store/user"
import FormData from "form-data"

function ProfileEdit() {
	const dispatch = useAppDispatch()
	const userId = useAppSelector(state => state.userId)
	const userInfo = useAppSelector(state => state.userInfo)
	const [newNickname, setNewNickname] = React.useState(userInfo.nickname)
	const [newHeight, setNewHeight] = React.useState<number | 0>(userInfo.height)
	const [imageUrl, setImageUrl] = React.useState("")
	const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions()

	async function uploadImage() {
		if (!status?.granted) {
			const permission = await requestPermission()
			if (!permission.granted) {
				return null
			}
		}
		// 이미지 업로드 기능
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			quality: 1,
			aspect: [1, 1]
		})
		// 이미지 업로드 취소한 경우
		if (result.cancelled) {
			return null
		}
		// 이미지 업로드 결과 및 이미지 경로 업데이트
		console.log(result)

		const localUri = result.uri
		const fileName = localUri.split("/").pop()
		const match = /\.(\w+)$/.exec(fileName ?? "")
		const type = match ? `image/${match[1]}` : "image"

		const formData = new FormData()
		formData.append("image", { uri: localUri, name: fileName, type })
		picture
			.changeProfile(formData)
			.then(result => {
				console.log("프로필 이미지 업로드 성공")
				setImageUrl(result.data)
			})
			.catch(err => {
				console.log("프로필 못 바꿈")
				console.log(err)
				alert("예기치 못한 이유로 업로드가 실패했습니다")
			})
	}

	function cancelUpload() {
		setImageUrl("")
	}

	function checkNickname(name: string) {
		if (name.length == 7) {
			alert("닉네임은 7글자 이하여야 합니다")
			return
		}
		const re = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/
		if (re.test(name)) {
			setNewNickname(name)
		} else {
			alert("닉네임은 숫자, 영어 또는 한글만 사용가능합니다 ")
			setNewNickname("")
		}
	}

	function checkHeight(height: number) {
		if (height < 0 || height > 250) {
			alert("키는 음수이거나 250보다 클 수 없습니다")
			return
		}
		setNewHeight(height)
	}

	function updateProfile() {
		// if (!newNickname || newHeight < 0 || newHeight > 250) {
		// 	alert("값을 다시 확인해주세요")
		// 	return
		// }
		const data = {
			height: newHeight,
			nickname: newNickname,
			username: userId.id,
			url: imageUrl
		}

		user
			.profileEdit(data)
			.then(result => {
				console.log("유저 정보 변경 성공")
				console.log(result.data)
				user
					.getInfo(userId.id)
					.then(result => {
						console.log("redux 값 업데이트")
						dispatch(getUserInfo(result.data))
					})
					.catch(err => {
						console.log("저장은 성공했으나 불러오기 못함")
					})
			})
			.catch(err => {
				console.log("실패함")
				console.log(err)
			})
	}

	return (
		<View>
			<Text>프로필 이미지</Text>
			<Image
				source={imageUrl ? { uri: imageUrl } : { uri: userInfo.url }}
				style={styles.profilePic}
			/>
			<Pressable onPress={uploadImage}>
				<Text>이미지 업로드하기</Text>
			</Pressable>
			<Pressable onPress={cancelUpload}>
				<Text>이미지 업로드 취소</Text>
			</Pressable>
			<Text>닉네임</Text>
			<Text>닉네임은 7글자 이하이며 숫자, 영어 또는 한글만 사용가능합니다 </Text>
			<TextInput
				onChangeText={text => checkNickname(text)}
				defaultValue={userInfo.nickname}
				maxLength={7}
				value={newNickname}
			></TextInput>
			<TextInput
				onChangeText={text => checkHeight(parseInt(text))}
				keyboardType={"numeric"}
				defaultValue={String(userInfo.height)}
				maxLength={3}
			></TextInput>
			<TextInput placeholder="기기의 번호를 등록해주세요"></TextInput>
			<Pressable onPress={updateProfile}>
				<Text>수정 완료</Text>
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
		width: 100,
		height: 100,
		marginRight: 12
	}
})

export default ProfileEdit
