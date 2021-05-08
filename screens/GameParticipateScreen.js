//working

import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ListItem , Divider} from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";


import { colors } from 'react-native-elements' 
//FIXME: https://github.com/react-native-elements/react-native-elements/pull/2561 
// @ts-ignore The typings are also missing "web" 
if (colors.platform.web == null) { 
  // @ts-ignore The typings are also missing "web" 
  colors.platform.web= { 
    primary: '#2089dc', 
    secondary: '#ca71eb',
    grey: '#393e42', 
    searchBg: '#303337', 
    success: '#52c41a', 
    error: '#ff190c', 
    warning: '#faad14'
 } }


export default class GameParticipateScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      requestedPlayersList: [],
    };
    this.requestRef = null;
  }

  getRequestedPlayerssList = () => {
    this.requestRef = db
      .collection("requested_games")
      .onSnapshot((snapshot) => {
        var requestedPlayersList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          requestedPlayersList: requestedPlayersList,
        });
      });
  };

  componentDidMount() {
    this.getRequestedPlayerssList();
  }

  componentWillUnmount() {
  this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <View>
      <ListItem 
      containerStyle={{backgroundColor: "#dab1ec"}}
        key={i}
        titleStyle={{ color: "black", fontWeight: "bold"}}
        title={item.game_name}
        subtitle={<Text>Players: {item.players_i_have}</Text>}
        leftElement={
          <Text style={{ backgroundColor: "yellow", paddingLeft: 10, paddingRight: 10}}>At: {item.play_time}</Text>
         }
        
        rightElement={
          <View>
          <TouchableOpacity            
            onPress={() => {
              this.props.navigation.navigate("PlayerDetails", {
                details: item,
              });
            }}
          >
          <Image source={require("../assets/viewplayer2.png")} style={{width:100, height:62, color: "yellow"}}/>
          </TouchableOpacity>
          </View>
        }
        //bottomDivider={{}}
      />
      <Divider style={{height: 4, backgroundColor: "black"}}/>
  </View>
    );
  };

  render() {
    return (
      <View style={styles.view}>
        <MyHeader title="Participate Games" navigation={this.props.navigation}/>
        <View style={{ flex: 1}}>
          {this.state.requestedPlayersList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Requested Games</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requestedPlayersList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 10,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  view:{
    flex: 1,
    backgroundColor: "#fff"
  }
});