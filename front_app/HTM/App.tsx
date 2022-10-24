import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import Main from "./screens/MainPage/Main"
import RoutineList from "./screens/RoutinesList/RoutinesList"
import AlarmList from "./screens/AlarmLsit/AlarmList"
import FriendsList from "./screens/FriendsList/FriendsList"
import MyRecord from "./screens/MyRecord/MyRecord"

const BottomTab = createBottomTabNavigator()
export default function App() {
	return (
		<>
			<StatusBar style="auto" />
			<NavigationContainer>
				<BottomTab.Navigator>
					<BottomTab.Screen name="Main" component={Main} />
					<BottomTab.Screen name="RoutineList" component={RoutineList} />
					<BottomTab.Screen name="MyRecord" component={MyRecord} />
					<BottomTab.Screen name="FriendsList" component={FriendsList} />
					<BottomTab.Screen name="AlarmList" component={AlarmList} />
				</BottomTab.Navigator>
			</NavigationContainer>
		</>
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
