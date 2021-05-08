import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity, Image } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';
import { RFValue } from "react-native-responsive-fontsize";

export default class MyReceivedPlayersScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      receivedPlayersList : []
    }
  this.requestRef= null
  }

  getReceivedPlayersList =()=>{
    this.requestRef = db.collection("received_games")
    .where('user_id','==',this.state.userId)
    .where("gameStatus", '==','received')
    .onSnapshot((snapshot)=>{
      var receivedPlayersList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receivedPlayersList : receivedPlayersList
      });
    })
  }

  componentDidMount(){
    this.getReceivedPlayersList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem key={i} bottomDivider>
         { <ListItem leftElement={<Image source={require("../assets/thanks.png")} style={{width:100, height:60}}/>} /> }
       <ListItem.Content>
       <ListItem.Title style={{ color: 'black', fontWeight: 'bold' }}>
       Game: {item.game_name}
       </ListItem.Title>
       <ListItem.Subtitle>
       {item.gameStatus}       
       </ListItem.Subtitle>

           
        </ListItem.Content>
        </ListItem>
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Received Players" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.receivedPlayersList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Received Players</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receivedPlayersList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }

})