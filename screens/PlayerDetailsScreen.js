import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config.js";
import firebase from "firebase";

export default class PlayerDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: "",
      playerId: this.props.navigation.getParam("details")["user_id"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      gameName: this.props.navigation.getParam("details")["game_name"],
      equipmentsIhave: this.props.navigation.getParam("details")["equipments_i_have"],
      playersIhave: this.props.navigation.getParam("details")["players_i_have"],
      playTime: this.props.navigation.getParam("details")["play_time"],
      playLocation: this.props.navigation.getParam("details")["play_location"],
      reason_for_requesting: this.props.navigation.getParam("details")[
        "reason_to_request"
      ],
      playerName: "",
      playerContact: "",
      playerAge: "",
      playerAddress: "",
      playerNearestPark: "",
      playerNearestPlayground: "",
      playerRequestDocId: "",
    };
  }

  getPlayerDetails() {
    db.collection("users")
      .where("email_id", "==", this.state.playerId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            playerName: doc.data().first_name,
            playerContact: doc.data().contact,
            playerAddress: doc.data().address,
            playerNearestPark: doc.data().nearest_park,
            playerNearestPlayground: doc.data().nearest_playGround,
            playerAge: doc.data().age
          });
        });
      });

    db.collection("requested_games")
      .where("request_id", "==", this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            playerRequestDocId: doc.id
          });
        });
      });
  }

  getUserDetails = (userId) => {
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  updateGameStatus = () => {
    db.collection("all_participations").add({
      game_name: this.state.gameName,
      request_id: this.state.requestId,
      requested_by: this.state.playerName,
      participant_id: this.state.userId,
      request_status: "Participant Interested",
    });
  };

  addNotification = () => {
    var message =
      this.state.userName + " has shown interest in playing with you.";
    db.collection("all_notifications").add({
      targeted_user_id: this.state.playerId,
      participant_id: this.state.userId,
      request_id: this.state.requestId,
      game_name: this.state.gameName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: "unread",
      message: message,
    });
  };

  componentDidMount() {
    this.getPlayerDetails();
    this.getUserDetails(this.state.userId);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
        <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#ffffff"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            
            centerComponent={{
              text: "View Player",
              style: {
                color: "#ffffff",
                fontSize: RFValue(20),
                fontWeight: "bold",
              },
            }}
            backgroundColor="#ef4f71"
          />
        </View>
        <View style={{ flex: 0.9 }}>
         
        <ScrollView>

            <View
              style={{
                flex: 0.6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(30),
                  textAlign: "center",
                  marginTop: RFValue(40),
                  borderBottomWidth: RFValue(2),
                  borderWidth: RFValue(2),
                  paddingRight: 10,
                  paddingLeft: 10,
                  padding: 3,
                  color: "red",
                  borderColor: "blue"
                }}
              >
                {this.state.gameName}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                Reason:
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: RFValue(15),
                  marginTop: RFValue(1),
                }}
              >             
               {this.state.reason_for_requesting}
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                Equipments I Have:
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: RFValue(15),
                  marginTop: RFValue(1),
                
                }}
              >             
               {this.state.equipmentsIhave}
              </Text>

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                Players I Have:
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: RFValue(15),
                  marginTop: RFValue(1),
                
                }}
              >             
               {this.state.playersIhave}  players
              </Text>

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                My Preferred Play Time:
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: RFValue(15),
                  marginTop: RFValue(1),
                
                }}
              >             
                {this.state.playTime}
              </Text>

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                My Preferred Play Location:
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: RFValue(15),
                  marginTop: RFValue(1),
                
                }}
              >             
                {this.state.playLocation}
              </Text>
             
                
               
              
            
              </View>
          
          <View
            style={{
              flex: 0.7,
              padding: RFValue(20),
              marginTop: RFValue(10)
            }}
          >
            <View style={{ flex: 0.7 ,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#deeedd',padding:RFValue(10)}}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(30),
                  textAlign: "center",
                  borderBottomWidth: RFValue(2),
                  borderWidth: RFValue(2),
                  paddingRight: 10,
                  paddingLeft: 10,
                  padding: 3,
                  color: "red",
                  borderColor: "blue"
                }}
              >
                Player Information
              </Text>
              

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                Name:
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: RFValue(15),
                  marginTop: RFValue(1),
                
                }}
              >             
                {this.state.playerName}
              </Text>

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                Contact:
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: RFValue(15),
                  marginTop: RFValue(1),
                
                }}
              >             
                {this.state.playerContact}
              </Text>

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                Age:
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: RFValue(15),
                  marginTop: RFValue(1),
                
                }}
              >             
                {this.state.playerAge}
              </Text>

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                Address:
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: RFValue(15),
                  marginTop: RFValue(1),
                
                }}
              >             
                {this.state.playerAddress}
              </Text>

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                Nearest Playground:
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: RFValue(15),
                  marginTop: RFValue(1),
                
                }}
              >             
                {this.state.playerNearestPlayground}
              </Text>

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                Nearest Park:
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  textAlign: "center",
                  fontSize: RFValue(15),
                  marginTop: RFValue(1),
                
                }}
              >             
                {this.state.playerNearestPark}
              </Text>
            </View>
            <View
              style={{
                flex: 0.3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.state.playerId !== this.state.userId ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.updateGameStatus();
                    this.addNotification();
                    this.props.navigation.navigate("MyParticipations");
                  }}
                >
                  <Text>I want to play</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          </ScrollView>

          
          
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(60),
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
   
    elevation: 16,
  },
});