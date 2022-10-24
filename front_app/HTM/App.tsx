import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import Main from "./screens/MainPage/Main"
import RoutineList from "./screens/RoutinesList/RoutinesList"
import AlarmList from "./screens/AlarmLsit/AlarmList"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

const Stack = createNativeStackNavigator()
export default function App() {
	return (
		<View style={styles.container}>
			<Text>왜 이러지</Text>
			<StatusBar style="auto" />
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Main" component={Main} />
				</Stack.Navigator>
			</NavigationContainer>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center"
	}
})
