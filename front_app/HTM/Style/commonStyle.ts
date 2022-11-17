import { StyleSheet } from "react-native"
import Constants from "expo-constants"

export const commonStyle = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "yellow",
		alignItems: "center",
		justifyContent: "center",
		marginTop: Constants.statusBarHeight
	},
	containerInner: {
		flex: 1,
		backgroundColor: "yellow",
		alignItems: "center",
		justifyContent: "center"
	}
})

export const color = {
	textInputGrey: "#f2f3f5",
	danger: "#fa6666",
	divider: "#EBEDFF"
}
type ObjType = {
	[index: string]: Object
}

export const exerciseColor: ObjType = {
	스쿼트: "#F2C4DE",
	"레터럴 스텝": "#71B1D9",
	"무릎 높이 들기": "#AED8F2",
	하이킥: "#F2DEA2",
	"사이드 니 업": "#F2CDC4",
	팔굽혀펴기: "#ABD3DB",
	크런치: "#C2E6DF",
	"마운틴 클라이머": "#D1EBD8",
	"플러터 킥": "#E5F5DC",
	"바이시클 크런치": "#FFFFE1"
}
