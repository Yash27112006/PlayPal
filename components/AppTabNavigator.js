import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator'
import PlayerRequestScreen from '../screens/PlayerRequestScreen';
import { RFValue } from 'react-native-responsive-fontsize';


export const AppTabNavigator = createBottomTabNavigator({
  ParticipateGames : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/listgames.png")} style={{width:60, height:60, marginBottom: RFValue(23)}}/>,
      tabBarLabel : "Participate Games",
    }
  },
  PlayerRequest: {
    screen: PlayerRequestScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/friends.png")} style={{width:40, height:50, marginBottom: RFValue(18)}}/>,
      tabBarLabel : "Player Request",
    }
  }
});