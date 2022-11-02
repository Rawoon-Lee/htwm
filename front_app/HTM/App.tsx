import { StatusBar } from "expo-status-bar"
import { SafeAreaView, StyleSheet, Text, View, Image } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { Provider } from "react-redux"
import {
	createStackNavigator,
	StackNavigationProp
} from "@react-navigation/stack"

import BottomTabNav from "./components/BottomTabNav"
import { store } from "./store/store"

import CreateRoutine from "./screens/RoutinesList/createRoutine"
import FriendSearch from "./screens/FriendsList/friendSearch"

const Stack = createStackNavigator()
export default function App() {
	return (
		<>
			<Provider store={store}>
				<NavigationContainer>
					<StatusBar />
					<Stack.Navigator initialRouteName="BottomTabNav">
						<Stack.Screen
							name="BottomTabNav"
							component={BottomTabNav}
							options={{ headerShown: false }}
						></Stack.Screen>
						<Stack.Screen
							name="CreateRoutine"
							component={CreateRoutine}
						></Stack.Screen>
						<Stack.Screen
							name="FriendSearch"
							component={FriendSearch}
						></Stack.Screen>
					</Stack.Navigator>
				</NavigationContainer>
			</Provider>
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
