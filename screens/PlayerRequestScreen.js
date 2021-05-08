import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Alert,
  Image,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { SearchBar, ListItem, Input } from "react-native-elements";

import MyHeader from "../components/MyHeader";

export default class PlayerRequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      gameName: "",
      reasonToRequest: "",
      equipmentsIhave: "",
      playersIhave: "",
      playTime: "",
      playLocation: "",
      IsPlayerRequestActive: "",
      requestedGameName: "",
      gameStatus: "",
      requestId: "",
      userDocId: "",
      docId: "",
      Imagelink: "#",
      dataSource: "",
      requestedImageLink: "",
      showFlatlist: false,
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (gameName, reasonToRequest, playLocation, playTime, playersIhave, equipmentsIhave) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();


    db.collection("requested_games").add({
      user_id: userId,
      game_name: gameName,
      reason_to_request: reasonToRequest,
      equipments_i_have: playersIhave,
      players_i_have: equipmentsIhave,
      play_time: playTime,
      play_location: playLocation,
      request_id: randomRequestId,
      game_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await this.getPlayerRequest();
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsPlayerRequestActive: true,
          });
        });
      });

    this.setState({
      gameName: "",
      reasonToRequest: "",
      equipmentsIhave: "",
      playersIhave: "",
      playTime: "",
      playLocation: "",
      requestId: randomRequestId,
    });

    return Alert.alert("Player Requested Successfully");
  };

  receivedPlayers = (gameName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_games").add({
      user_id: userId,
      game_name: gameName,
      request_id: requestId,
      gameStatus: "Player Received",
    });
  };

  getIsPlayerRequestActive() {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsPlayerRequestActive: doc.data().IsPlayerRequestActive,
            userDocId: doc.id,
          });
        });
      });
  }

  getPlayerRequest = () => {
    // getting the requested book
    var gameRequest = db
      .collection("requested_games")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().book_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedGameName: doc.data().game_name,
              gameStatus: doc.data().game_status,
              requestedImageLink: doc.data().image_link,
              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var participantId = doc.data().participant_id;
                var gameName = doc.data().game_name;

                db.collection("all_notifications").add({
                  targeted_user_id: participantId,
                  message:
                    name + " " + lastName + " says 'THANK YOU for playing " + gameName + " with me'.",
                  notification_status: "unread",
                  game_name: gameName,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getPlayerRequest();
    this.getIsPlayerRequestActive();
  }

  updatePlayerRequestStatus = () => {
    //updating the book status after receiving the book
    db.collection("requested_games").doc(this.state.docId).update({
      game_status: "requested",
    });

    //getting the  doc id to update the users doc
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection("users").doc(doc.id).update({
            IsPlayerRequestActive: false,
          });
        });
      });
  };

  

  //render Items  functionto render the books from api
  renderItem = ({ item, i }) => {


    let obj = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLinks,
    };

    return (
      <TouchableHighlight
        style={styles.touchableopacity}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => {
          this.setState({
            showFlatlist: false,
            gameName: item.volumeInfo.title,
          });
        }}
        bottomDivider
      >
        <Text> {item.volumeInfo.title} </Text>
      </TouchableHighlight>
    );
  };

  render() {
    if (this.state.IsPlayerRequestActive === true) {
      return (
        <View style={{ flex: 1, backgroundColor :"yellow"}}>
          <View
            style={{
              flex: 0.1,
            }}
          >
            <MyHeader title="Game Status" navigation={this.props.navigation} />
          </View>
          <View
            style={styles.ImageView}
          >
            
          </View>
          <View
            style={styles.gamestatus}
          >
            <Text
               style={styles.gameStatus}
             
            >
              Name of the Game: 
            </Text>

            <Text
              style={styles.status}
            >
              {this.state.requestedGameName}
            </Text>

            <Text
              style={styles.bookStatus}
            >
              Status: 
            </Text>
            <Text
              style={styles.status}
            >
              {this.state.gameStatus}
            </Text>
          </View>
          <View
            style={styles.buttonView}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updatePlayerRequestStatus();
                this.receivedPlayers(this.state.requestedGameName);
              }}
            >
              <Text
                style={styles.buttontxt}
              >
                Player Recived
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#dab1ec" }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Request Player" navigation={this.props.navigation} />
        </View>
        <ScrollView style={styles.scrollview}>

        <View style={{ flex: 0.9 }}>
          <Input
            style={styles.formTextInput2}
            label={"Game Name"}
            placeholder={"Game name"}
            containerStyle={{ marginTop: RFValue(60) }}
            onChangeText={(text) => {
              this.setState({
                gameName: text,
              });
            }}
            value={this.state.gameName}
          />
         
            <View style={{ alignItems: "center" }}>
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(2) }}
               
                label={"Reason"}
                placeholder={"Why do you want players?"}
                onChangeText={(text) => {
                  this.setState({
                    reasonToRequest: text,
                  });
                }}
                value={this.state.reasonToRequest}
              />
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(2) }}
                label={"Equipments"}
                placeholder={"Equipments you have for the game"}
                onChangeText={(text) => {
                  this.setState({
                    equipmentsIhave: text,
                  });
                }}
                value={this.state.equipmentsIhave}
              />
              <Input
                  style={styles.formTextInput2}
                  containerStyle={{ marginTop: RFValue(2) }}
                label={"Players"}
                keyboardType={"numeric"}

                placeholder={"Players you have for the game"}
                onChangeText={(text) => {
                  this.setState({
                    playersIhave: text,
                  });
                }}
                value={this.state.playersIhave}
              />
              <Input
                 style={styles.formTextInput2}
                 containerStyle={{ marginTop: RFValue(2) }}
                label={"Time (specifiy a.m or p.m)"}
                placeholder={"Tell the time to play"}
                onChangeText={(text) => {
                  this.setState({
                    playTime: text,
                  });
                }}
                value={this.state.playTime}
              />
              <Input
              style={styles.formTextInput2}
              containerStyle={{ marginTop: RFValue(2) }}
                label={"Location"}
                placeholder={"Tell the location to play"}
                onChangeText={(text) => {
                  this.setState({
                    playLocation: text,
                  });
                }}
                value={this.state.playLocation}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: RFValue(10) }]}
                onPress={() => {
                  this.addRequest(
                    this.state.gameName,
                    this.state.reasonToRequest,
                    this.state.playLocation,
                    this.state.playTime,
                    this.state.equipmentsIhave,
                    this.state.playersIhave
                  );
                }}
              >
                <Text
                  style={styles.requestbuttontxt}
                >
                  Request
                </Text>
              </TouchableOpacity>
            </View>
         
        </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: RFValue(105),
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white"
  },
  formTextInput2: {
    width: "75%",
    height: RFValue(50),
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white"
  },
  ImageView:{
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop:20
  },
  imageStyle:{
    height: RFValue(150),
    width: RFValue(150),
    alignSelf: "center",
    borderWidth: 5,
    borderRadius: RFValue(10),
  },
  gamestatus:{
    flex: 0.4,
    alignItems: "center",

  },
  scrollview: {
    flex: 0.8,
  },
  status:{
    fontSize: RFValue(20),
    marginTop: RFValue(10),
  },
  gameStatus:{
    fontSize: RFValue(20),
    fontWeight: "bold",
    marginTop: RFValue(10),
  },
  buttonView:{
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttontxt:{
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#fff",
  },
  touchableopacity:{
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "90%",
  },
  requestbuttontxt:{
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#ef4f71",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});