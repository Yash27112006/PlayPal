import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet, Image} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js';


export default class MyParticipationScreen extends Component {
  constructor(){
    super()
    this.state = {
      participantId : firebase.auth().currentUser.email,
      participantName : "",
      allParticipations : []
    }
    this.requestRef= null
  }

  static navigationOptions = { header: null };

   getParticipantDetails=(participantId)=>{
     db.collection("users").where("email_id","==", participantId).get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         this.setState({
           "participantName" : doc.data().first_name + " " + doc.data().last_name
         })
       });
     })
   }
   getAllParticipations =()=>{
    this.requestRef = db.collection("all_participations").where("participant_id" ,'==', this.state.participantId)
    .onSnapshot((snapshot)=>{
      var allParticipations = []
      snapshot.docs.map((doc) =>{
        var participation = doc.data()
        participation["doc_id"] = doc.id
        allParticipations.push(participation)
      });
      this.setState({
        allParticipations : allParticipations
      });
    })
  }

  playFinally=(gameDetails)=>{
    if(gameDetails.request_status === "Played"){
      var requestStatus = "Player Interested"
      db.collection("all_participations").doc(gameDetails.doc_id).update({
        "request_status" : "Player Interested"
      })
      this.sendNotification(gameDetails,requestStatus)
    }
    else{
      var requestStatus = "Played"
      db.collection("all_participations").doc(gameDetails.doc_id).update({
        "request_status" : "Played"
      })
      this.sendNotification(gameDetails,requestStatus)
    }
  }

   sendNotification=(gameDetails,requestStatus)=>{
    var requestId = gameDetails.request_id
    var participantId = gameDetails.participant_id

    db.collection("all_notifications")
    .where("request_id","==", requestId)
    .where("participant_id","==",participantId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        var message = ""
        if(requestStatus === "Played"){
          message = this.state.participantName + " played with you."
        }else{
           message =  this.state.participantName  + " has shown interest in playing with you."
        }
        db.collection("all_notifications").doc(doc.id).update({
          "message": message,
          "notification_status" : "unread",
          "date"                : firebase.firestore.FieldValue.serverTimestamp()
        })
      });
    })
  }

   componentDidMount(){
    this.getParticipantDetails(this.state.participantId)
    this.getAllParticipations()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem key={i} bottomDivider>
              { <ListItem leftElement={<Image source={require("../assets/teamup.png")} style={{width:70, height:70, marginBottom: 18}}/>} /> }
       <ListItem.Content>
         <ListItem.Title style={{ color: 'black', fontWeight: 'bold' }}>
       Game: {item.game_name}
       </ListItem.Title>

       <ListItem.Subtitle>
       {"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       </ListItem.Subtitle>


        <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor : item.request_status === "Played" ? "green" : "#ff5722"
          }
        ]}
        onPress = {()=>{
          this.playFinally(item)
        }}
       >
            <Text style={{color:'#ffff'}}>{
               item.request_status === "Played" ? "Played" : "Play Finally"
             }</Text>
           </TouchableOpacity>
           
       </ListItem.Content>
       </ListItem>

   )

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Participations"/>
         <View style={{flex:1}}>
           {
             this.state.allParticipations.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all Game Participations</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allParticipations}
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
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})