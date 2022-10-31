import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View, Image } from "react-native"
import { NavigationContainer } from "@react-navigation/native"

import {
	createStackNavigator,
	StackNavigationProp
} from "@react-navigation/stack"

import BottomTabNav from "./components/BottomTabNav"
import CreateRoutine from "./screens/RoutinesList/createRoutine"

const Stack = createStackNavigator()
export default function App() {
	return (
		<>
			<StatusBar style="auto" />
			<NavigationContainer>
				<Stack.Navigator initialRouteName="BottomTabNav">
					<Stack.Screen
						name="BottomTabNav"
						component={BottomTabNav}
						options={{ headerShown: false }}
					></Stack.Screen>
					<Stack.Screen
						name="CreateRoutine"
						component={CreateRoutine}
						options={{ headerShown: false }}
					></Stack.Screen>
				</Stack.Navigator>
				{/* <BottomTabNav></BottomTabNav> */}
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
