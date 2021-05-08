import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import MyParticipationScreen from '../screens/MyParticipationScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/SettingScreen';
import MyReceivedPlayersScreen from '../screens/MyReceivedPlayersScreen';

import {Icon} from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator({



  
  Home : {
    screen : AppTabNavigator,
    navigationOptions:{
      drawerIcon : <Icon name="home" type ="fontawesome5" />
    }
    
    },
  MyParticipations : {
    screen : MyParticipationScreen,
    navigationOptions:{
      drawerIcon : <Icon name="hand-holding-heart" type ="font-awesome-5" />,
      drawerLabel : "My Participations",
    }
  },
  Notification : {
    screen : NotificationScreen,
    navigationOptions:{
      drawerIcon : <Icon name="bell" type ="font-awesome" />,
      drawerLabel : "Notifications"
    }
  },
  MyReceivedPlayers :{
    screen: MyReceivedPlayersScreen,
    navigationOptions:{
      drawerIcon : <Icon name="handshake-o" type ="font-awesome" style={{width: 50}}/>,
      drawerLabel : "My Received Players",

    }
  },
  Setting : {
    screen : SettingScreen,
    navigationOptions:{
      drawerIcon : <Icon name="user-circle-o" type ="font-awesome" />,
      drawerLabel : "Profile"
    }
  }
},
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })