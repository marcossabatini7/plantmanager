import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { MaterialIcons } from '@expo/vector-icons'

import { PlantSelect } from '../pages/PlantSelect'
import { MyPlants } from '../pages/MyPlants'

import colors from '../styles/colors'

const { Navigator, Screen } = createBottomTabNavigator()

const AuthRoutes = () => {
  return (
    <Navigator
      tabBarOptions={{
        activeTintColor: colors.green,
        inactiveTintColor: colors.heading,
        labelPosition: 'beside-icon',
        style: { height: 88 },
      }}
    >
      <Screen
        name='Nova Planta'
        component={PlantSelect}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name='add-circle-outline'
              size={size}
              color={color}
            />
          ),
        }}
      ></Screen>
      <Screen
        name='Minhas Plantas'
        component={MyPlants}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name='format-list-bulleted'
              size={size}
              color={color}
            />
          ),
        }}
      ></Screen>
    </Navigator>
  )
}

export default AuthRoutes
