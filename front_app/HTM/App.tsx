import { StatusBar } from "expo-status-bar"
import { StyleSheet, Text, View, Image } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { Provider } from "react-redux"
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack"
import * as React from "react"
import BottomTabNav from "./components/BottomTabNav"
import { store } from "./store/store"
import CreateRoutine from "./screens/RoutinesList/createRoutine"
import FriendSearch from "./screens/FriendsList/friendSearch"
import ProfileEdit from "./screens/ProfileEdit/ProfileEdit"

import Constants from "expo-constants"
import * as SplashScreen from "expo-splash-screen"

const Stack = createStackNavigator()
export default function App() {
	const [appIsReady, setAppIsReady] = React.useState(false)
	React.useEffect(() => {
		async function prepare() {
			try {
				await new Promise(resolve => setTimeout(resolve, 1000))
			} catch (e) {
				console.warn(e)
			} finally {
				// Tell the application to render
				setAppIsReady(true)
			}
		}

		prepare()
	}, [])

	const onLayoutRootView = React.useCallback(async () => {
		if (appIsReady) {
			// This tells the splash screen to hide immediately! If we call this after
			// `setAppIsReady`, then we may see a blank screen while the app is
			// loading its initial state and rendering its first pixels. So instead,
			// we hide the splash screen once we know the root view has already
			// performed layout.
			await SplashScreen.hideAsync()
		}
	}, [appIsReady])

	if (!appIsReady) {
		return null
	}

	return (
		<>
			<StatusBar style="light" backgroundColor="red" />
			<Provider store={store}>
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
							options={{
								title: "루틴 생성하기",
								gestureEnabled: true,
								headerBackTitle: "뒤로",
								headerBackTitleVisible: true,
								headerTitleAlign: "center",
								headerStatusBarHeight: Constants.statusBarHeight
							}}
						></Stack.Screen>
						<Stack.Screen
							name="FriendSearch"
							component={FriendSearch}
							options={{
								title: "친구 추가",
								gestureEnabled: true,
								headerBackTitle: "뒤로",
								headerBackTitleVisible: true,
								headerTitleAlign: "center",
								headerStatusBarHeight: Constants.statusBarHeight
							}}
						></Stack.Screen>
						<Stack.Screen
							name="ProfileEdit"
							component={ProfileEdit}
							options={{
								title: "회원정보 수정",
								gestureEnabled: true,
								headerBackTitle: "뒤로",
								headerBackTitleVisible: true,
								headerTitleAlign: "center",
								headerStatusBarHeight: Constants.statusBarHeight
							}}
						></Stack.Screen>
					</Stack.Navigator>
				</NavigationContainer>
			</Provider>
		</>
	)
}

const styles = StyleSheet.create({})
