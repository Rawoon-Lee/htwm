import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Feather } from "@expo/vector-icons"

import Main from "../screens/MainPage/Main"
import RoutineList from "../screens/RoutinesList/RoutinesList"
import AlarmList from "../screens/AlarmLsit/AlarmList"
import FriendsList from "../screens/FriendsList/FriendsList"
import MyRecord from "../screens/MyRecord/MyRecord"

const BottomTab = createBottomTabNavigator()

export default function BottomTabNav({ navigation }: any) {
	return (
		<BottomTab.Navigator
			screenOptions={{
				tabBarActiveTintColor: "#FFA500",
				tabBarLabelStyle: {
					fontSize: 13
				}
			}}
		>
			<BottomTab.Screen
				name="Home"
				component={Main}
				options={{
					headerShown: false,
					// tabBarLabel: "홈",
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Feather name="home" size={24} color="#FFA500" />
						) : (
							<Feather name="home" size={24} color="#b4b4b4" />
						)
				}}
			/>
			<BottomTab.Screen
				name="RoutineList"
				component={RoutineList}
				options={{
					headerShown: false,
					tabBarLabel: "루틴",
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Feather name="list" size={24} color="#FFA500" />
						) : (
							<Feather name="list" size={24} color="#b4b4b4" />
						)
				}}
			/>
			<BottomTab.Screen
				name="MyRecord"
				component={MyRecord}
				options={{
					headerShown: false,
					tabBarLabel: "기록",
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Feather name="calendar" size={24} color="#FFA500" />
						) : (
							<Feather name="calendar" size={24} color="#b4b4b4" />
						)
				}}
			/>
			<BottomTab.Screen
				name="FriendsList"
				component={FriendsList}
				options={{
					headerShown: false,
					tabBarLabel: "친구",
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Feather name="users" size={24} color="#FFA500" />
						) : (
							<Feather name="users" size={24} color="#b4b4b4" />
						)
				}}
			/>
			<BottomTab.Screen
				name="AlarmList"
				component={AlarmList}
				options={{
					headerShown: false,
					tabBarLabel: "알림",
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Feather name="bell" size={24} color="#FFA500" />
						) : (
							<Feather name="bell" size={24} color="#b4b4b4" />
						)
				}}
			/>
		</BottomTab.Navigator>
	)
}
