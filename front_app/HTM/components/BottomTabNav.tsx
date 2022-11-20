import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { Feather } from "@expo/vector-icons"

import Main from "../screens/MainPage/Main"
import RoutineList from "../screens/RoutinesList/RoutinesList"
import AlarmList from "../screens/AlarmList/AlarmList"
import FriendsList from "../screens/FriendsList/FriendsList"
import MyRecord from "../screens/MyRecord/MyRecord"

const BottomTab = createBottomTabNavigator()

export default function BottomTabNav({ navigation }: any) {
	return (
		<>
			<BottomTab.Navigator
				screenOptions={{
					tabBarActiveTintColor: "#9A9FE6",
					tabBarLabelStyle: {
						fontSize: 13
					},
					tabBarInactiveTintColor: "#bebebe"
				}}
				initialRouteName={"Home"}
			>
				<BottomTab.Screen
					name="RoutineList"
					component={RoutineList}
					options={{
						unmountOnBlur: true,
						headerShown: false,
						tabBarLabel: "루틴",
						tabBarIcon: ({ focused }) =>
							focused ? (
								<Feather name="list" size={24} color="#9A9FE6" />
							) : (
								<Feather name="list" size={24} color="#bebebe" />
							)
					}}
				/>
				<BottomTab.Screen
					name="MyRecord"
					component={MyRecord}
					options={{
						unmountOnBlur: true,
						headerShown: false,
						tabBarLabel: "기록",
						tabBarIcon: ({ focused }) =>
							focused ? (
								<Feather name="calendar" size={24} color="#9A9FE6" />
							) : (
								<Feather name="calendar" size={24} color="#bebebe" />
							)
					}}
				/>
				<BottomTab.Screen
					name="Home"
					component={Main}
					options={{
						headerShown: false,
						tabBarLabel: "홈",
						tabBarIcon: ({ focused }) =>
							focused ? (
								<Feather name="home" size={24} color="#9A9FE6" />
							) : (
								<Feather name="home" size={24} color="#bebebe" />
							)
					}}
				/>
				<BottomTab.Screen
					name="FriendsList"
					component={FriendsList}
					options={{
						unmountOnBlur: true,
						headerShown: false,
						tabBarLabel: "친구",
						tabBarIcon: ({ focused }) =>
							focused ? (
								<Feather name="users" size={24} color="#9A9FE6" />
							) : (
								<Feather name="users" size={24} color="#bebebe" />
							)
					}}
				/>
				<BottomTab.Screen
					name="AlarmList"
					component={AlarmList}
					options={{
						unmountOnBlur: true,
						headerShown: false,
						tabBarLabel: "알림",
						tabBarIcon: ({ focused }) =>
							focused ? (
								<Feather name="bell" size={24} color="#9A9FE6" />
							) : (
								<Feather name="bell" size={24} color="#bebebe" />
							)
					}}
				/>
			</BottomTab.Navigator>
		</>
	)
}
