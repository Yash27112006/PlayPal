import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card } from "react-native-elements";
import MyHeader from "../components/MyHeader";
import firebase from "firebase";

import db from "../config";
import { RFValue } from "react-native-responsive-fontsize";

export default class SettingScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: "",
      firstName: "",
      lastName: "",
      age: "",
      address: "",
      school: "",
      nearestPlayground: "",
      nearestPark: "",
      contact: "",
      docId: "",
    };
  }

  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("users")
      .where("email_id", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailId: data.email_id,
            firstName: data.first_name,
            lastName: data.last_name,
            age: data.age,
            address: data.address,
            school: data.school,
            nearestPark: data.nearest_park,
            nearestPlayground: data.nearest_playGround,
            contact: data.contact,
            docId: doc.id,
          });
        });
      });
  };

  updateUserDetails = () => {
    db.collection("users").doc(this.state.docId).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address: this.state.address,
      contact: this.state.contact,
      age: this.state.age,
      school: this.state.school,
      nearest_park: this.state.nearestPark,
      nearest_playGround: this.state.nearestPlayground,
    });

    Alert.alert("Profile Updated Successfully");
  };

  componentDidMount() {
    this.getUserDetails();
  }

  render() {
    return (
      <View style={{ flex: 1}}>
        <View style={{ flex: 0.12}}>
          <MyHeader title="Settings" navigation={this.props.navigation} />
        </View>

        <View style={styles.formContainer}>
        <ScrollView>

            <View
              style={{
                flex: 0.66,
                padding: RFValue(10),
                marginTop: RFValue(10)
              }}
            >
            <Text style={styles.label}>First Name </Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={"First Name"}
                maxLength={12}
                onChangeText={(text) => {
                  this.setState({
                    firstName: text,
                  });
                }}
                value={this.state.firstName}
              />

            <Text style={styles.label}>Last Name </Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={"Last Name"}
                maxLength={12}
                onChangeText={(text) => {
                  this.setState({
                    lastName: text,
                  });
                }}
                value={this.state.lastName}
              />

              <Text style={styles.label}>Age </Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={"Age"}
                maxLength={2}
                keyboardType={"numeric"}
                onChangeText={(text) => {
                  this.setState({
                    age: text,
                  });
                }}
                value={this.state.age}
              />

                <Text style={styles.label}>Contact </Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={"Contact"}
                maxLength={10}
                keyboardType={"numeric"}
                onChangeText={(text) => {
                  this.setState({
                    contact: text,
                  });
                }}
                value={this.state.contact}
              />

                <Text style={styles.label}>Address </Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={"Address"}
                multiline={true}
                onChangeText={(text) => {
                  this.setState({
                    address: text,
                  });
                }}
                value={this.state.address}
              />

              <Text style={styles.label}>School </Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={"School"}
                multiline={true}
                onChangeText={(text) => {
                  this.setState({
                    school: text,
                  });
                }}
                value={this.state.school}
              />

              <Text style={styles.label}>Nearest Park </Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={"Nearest Park"}
                maxLength={12}
                onChangeText={(text) => {
                  this.setState({
                    nearestPark: text,
                  });
                }}
                value={this.state.nearestPark}
              />

              <Text style={styles.label}>Nearest Playground </Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={"Nearest Playground"}
                maxLength={12}
                onChangeText={(text) => {
                  this.setState({
                    nearestPlayground: text,
                  });
                }}
                value={this.state.nearestPlayground}
              />

            </View>
              <View style={styles.buttonView}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.updateUserDetails();
                  }}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:"#6fc0b8"
  },
  formContainer:{
    flex: 0.88,
    justifyContent:'center',
    backgroundColor: "#dab1ec"
  },
  label:{
    fontSize:RFValue(18),
    color:"#717D7E",
    fontWeight:'bold',
    padding:RFValue(10),
    marginLeft:RFValue(20)
  },
  formTextInput: {
    width: "90%",
    height: RFValue(50),
    padding: RFValue(10),
    borderWidth:1,
    borderRadius:2,
    borderColor:"grey",
    marginBottom:RFValue(20),
    marginLeft:RFValue(20),
    backgroundColor: "white"
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
    marginTop: RFValue(-100),
  },
  buttonView:{
    flex: 0.22,
    alignItems: "center",
    marginTop:RFValue(100)
},
  buttonText: {
    fontSize: RFValue(23),
    fontWeight: "bold",
    color: "#fff",
  },
});