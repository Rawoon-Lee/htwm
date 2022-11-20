import { Text, View, Image, StyleSheet, TextInput, Pressable } from "react-native"
import * as React from "react"
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"

import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

import { useAppSelector, useAppDispatch } from "../../store/hook"
import { user } from "../../api/userAPI"
import { picture } from "../../api/pictureAPI"
import { getUserInfo, initUserId } from "../../store/user"
import FormData from "form-data"

import { color } from "../../Style/commonStyle"

function ProfileEdit({ navigation }: any) {
	const dispatch = useAppDispatch()
	const userId = useAppSelector(state => state.userId)
	const userInfo = useAppSelector(state => state.userInfo)
	const [newNickname, setNewNickname] = React.useState(userInfo.nickname)
	const [newHeight, setNewHeight] = React.useState<number | 0>(userInfo.height)
	const [uuid, setUuid] = React.useState("")
	const [imageUrl, setImageUrl] = React.useState("")
	const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions()

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
		setImageUrl(userInfo.url)
	}, [])

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

		const localUri = result.uri
		const fileName = localUri.split("/").pop()
		const match = /\.(\w+)$/.exec(fileName ?? "")
		const type = match ? `image/${match[1]}` : "image"

		const formData = new FormData()
		formData.append("image", { uri: localUri, name: fileName, type })
		picture
			.changeProfile(formData)
			.then(result => {
				setImageUrl(result.data)
			})
			.catch(err => {
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
		const data = {
			height: newHeight,
			nickname: newNickname,
			username: userId.id,
			url: imageUrl
		}

		user
			.profileEdit(data)
			.then(result => {
				alert("유저 정보가 성공적으로 변경되었습니다")
				user
					.getInfo(userId.id)
					.then(result => {
						dispatch(getUserInfo(result.data))
					})
					.catch(err => {
						console.log("저장은 성공했으나 불러오기 못함")
					})
			})
			.catch(err => {
				console.log(err)
			})
	}

	function registerUuid() {
		if (!uuid) return
		const data = {
			username: userId.id,
			uuid: uuid
		}
		user
			.registerUuid(data)
			.then(result => {
				alert("기기 등록이 완료되었습니다")
			})
			.catch(err => {
				alert(err.response.data)
				// if (err.response.data == "uuid 가 존재하지 않습니다.") {
				// 	alert(err.response.data)
				// }
			})
	}

	async function logout() {
		await AsyncStorage.removeItem("userId")
		let data = {
			nickname: "",
			url: "",
			height: 0
		}
		await dispatch(getUserInfo(data))
		await dispatch(initUserId())
		navigation.navigate("Home")
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
		<View onLayout={onLayoutRootView} style={styles.container}>
			<View style={{ backgroundColor: "#EBEDFF" }}>
				<Text style={{ fontFamily: "line-bd", fontSize: 20, textAlign: "left", padding: 5 }}>
					프로필 이미지
				</Text>
			</View>
			<View style={[styles.partsrow, { margin: 20 }]}>
				<Image
					source={imageUrl ? { uri: imageUrl } : { uri: userInfo.url }}
					style={styles.profilePic}
				/>
				<View style={{ marginLeft: 5 }}>
					<View
						style={{
							backgroundColor: "lightgreen",
							paddingLeft: 10,
							paddingRight: 10,
							paddingBottom: 5,
							paddingTop: 5,
							borderRadius: 7,
							margin: 4,
							elevation: 2
						}}
					>
						<Pressable onPress={uploadImage}>
							<Text style={{ textAlign: "center" }}>이미지 업로드하기</Text>
						</Pressable>
					</View>
					<View
						style={{
							backgroundColor: "#fff",
							paddingLeft: 10,
							paddingRight: 10,
							paddingBottom: 5,
							paddingTop: 5,
							borderRadius: 7,
							elevation: 2,
							margin: 4
						}}
					>
						<Pressable onPress={cancelUpload}>
							<Text>이미지 업로드 취소</Text>
						</Pressable>
					</View>
				</View>
			</View>
			<View style={{ backgroundColor: "#EBEDFF" }}>
				<Text style={{ fontFamily: "line-bd", fontSize: 20, textAlign: "left", padding: 5 }}>
					닉네임
				</Text>
			</View>
			<Text style={{ fontFamily: "line-rg", marginLeft: 12, marginTop: 10 }}>
				닉네임은 숫자, 영어 또는 한글로, 7글자 이하여야 합니다
			</Text>
			<TextInput
				onChangeText={text => checkNickname(text)}
				defaultValue={userInfo.nickname}
				maxLength={7}
				value={newNickname}
				style={{
					backgroundColor: color.textInputGrey,
					padding: 10,
					borderRadius: 10,
					margin: 10,
					fontFamily: "line-rg",
					fontSize: 15
				}}
			></TextInput>
			<View style={{ backgroundColor: "#EBEDFF" }}>
				<Text style={{ fontFamily: "line-bd", fontSize: 20, textAlign: "left", padding: 5 }}>
					키
				</Text>
			</View>
			<TextInput
				onChangeText={text => checkHeight(parseInt(text))}
				keyboardType={"numeric"}
				defaultValue={String(userInfo.height)}
				maxLength={3}
				style={{
					backgroundColor: color.textInputGrey,
					padding: 10,
					borderRadius: 10,
					margin: 10,
					fontFamily: "line-rg"
				}}
			></TextInput>
			<View style={{ backgroundColor: "#EBEDFF" }}>
				<Text style={{ fontFamily: "line-bd", fontSize: 20, textAlign: "left", padding: 5 }}>
					기기 등록
				</Text>
			</View>
			<TextInput
				placeholder="기기의 번호를 등록해주세요"
				onChangeText={text => setUuid(text)}
				style={{
					backgroundColor: color.textInputGrey,
					padding: 10,
					borderRadius: 10,
					margin: 10,
					fontFamily: "line-rg"
				}}
			></TextInput>
			<View
				style={{
					backgroundColor: "lightgreen",
					paddingLeft: 10,
					paddingRight: 10,
					paddingBottom: 5,
					paddingTop: 5,
					borderRadius: 7,
					marginLeft: 10,
					marginRight: 10,
					elevation: 2
				}}
			>
				<Pressable onPress={registerUuid}>
					<Text style={{ textAlign: "center", fontFamily: "line-rg", paddingVertical: 3 }}>
						기기 등록
					</Text>
				</Pressable>
			</View>
			<View
				style={{
					backgroundColor: "skyblue",
					padding: 10,
					borderRadius: 7,
					marginLeft: 10,
					marginRight: 10,
					marginTop: 25
				}}
			>
				<Pressable onPress={updateProfile}>
					<Text
						style={{
							paddingVertical: 3,
							textAlign: "center",
							fontFamily: "line-bd",
							fontSize: 18,
							color: "white"
						}}
					>
						수정 완료
					</Text>
				</Pressable>
			</View>
			<View
				style={{
					backgroundColor: `#fff`,
					borderWidth: 2,
					borderRadius: 10,
					borderColor: color.textInputGrey,
					padding: 10,
					marginLeft: 10,
					marginRight: 10,
					marginTop: 10
				}}
			>
				<Pressable onPress={logout}>
					<Text
						style={{
							color: color.danger,
							paddingVertical: 3,
							textAlign: "center",
							fontFamily: "line-rg",
							fontSize: 15
						}}
					>
						로그아웃
					</Text>
				</Pressable>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		flex: 1,
		backgroundColor: "#fff"
	},
	parts: {
		justifyContent: "center",
		elevation: 4,
		padding: 20,
		alignItems: "center"
	},
	partsrow: {
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row"
	},
	text: {
		fontSize: 40
	},
	profilePic: {
		width: 100,
		height: 100,
		borderRadius: 30
	}
})

export default ProfileEdit
