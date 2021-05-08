import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";

import db from "../config";
import firebase from 'firebase';

import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

export default class WelcomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      contact: "",
      school: "",
      age: "",
      confirmPassword: "",
      nearestPlayGround: "",
      nearestPark: "",
      isModalVisible: "false"
    };
  }

  userSignUp = (emailId, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return Alert.alert("password doesn't match\nCheck your password.");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then(() => {
          db.collection("users").add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            contact: this.state.contact,
            email_id: this.state.emailId,
            address: this.state.address,
            school: this.state.school,
            age: this.state.age,
            nearest_playGround: this.state.nearestPlayGround,
            nearest_park: this.state.nearestPark,
            IsPlayerRequestActive: false
          });
          return Alert.alert("User Added Successfully", "", [
            {
              text: "OK",
              onPress: () => this.setState({ isModalVisible: false })
            }
          ]);
        })
        .catch(error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  };

  userLogin = (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then(() => {
        this.props.navigation.navigate("ParticipateGames");
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      });
  };

  showModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <ScrollView style={styles.scrollview}>
          <View style={styles.signupView}>
            <Text style={styles.signupText}> SIGN UP </Text>
          </View>
          <View style={{ flex: 0.95 }}>
            <Text style={styles.label}>First Name </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"First Name"}
              maxLength={12}
              onChangeText={text => {
                this.setState({
                  firstName: text
                });
              }}
            />

            <Text style={styles.label}>Last Name </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Last Name"}
              maxLength={12}
              onChangeText={text => {
                this.setState({
                  lastName: text
                });
              }}
            />

            <Text style={styles.label}>Contact </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Contact"}
              maxLength={10}
              keyboardType={"numeric"}
              onChangeText={text => {
                this.setState({
                  contact: text
                });
              }}
            />

            <Text style={styles.label}>Age </Text>
            <TextInput
                style={styles.formInput}
                placeholder={"Age"}
                maxLength={2}
                keyboardType={"numeric"}
                onChangeText={text => {
                  this.setState({
                    age: text
                  });
                }}
            />

            <Text style={styles.label}> Address </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Address"}
              multiline={true}
              onChangeText={text => {
                this.setState({
                  address: text
                });
              }}
            />

            <Text style={styles.label}> School </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"School name"}
              multiline={true}
              onChangeText={text => {
                this.setState({
                  school: text
                });
              }}
            />

            <Text style={styles.label}>Nearest Playground</Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Nearest Playground"}
              maxLength={15}
              onChangeText={text => {
                this.setState({
                  nearestPlayGround: text
                });
              }}
            />

            <Text style={styles.label}>Nearest Park</Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Nearest Park"}
              maxLength={15}
              onChangeText={text => {
                this.setState({
                  nearestPark: text
                });
              }}
            />

            <Text style={styles.label}>Email </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Email"}
              keyboardType={"email-address"}
              onChangeText={text => {
                this.setState({
                  emailId: text
                });
              }}
            />

            <Text style={styles.label}> Password </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Password"}
              secureTextEntry={true}
              onChangeText={text => {
                this.setState({
                  password: text
                });
              }}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Confrim Password"}
              secureTextEntry={true}
              onChangeText={text => {
                this.setState({
                  confirmPassword: text
                });
              }}
            />
          </View>

          <View style={{ flex: 0.2, alignItems: "center" }}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() =>
                this.userSignUp(
                  this.state.emailId,
                  this.state.password,
                  this.state.confirmPassword
                )
              }
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
            <Text
              style={styles.cancelButtonText}
              onPress={() => {
                this.setState({ isModalVisible: false });
              }}
            >
              Cancel
            </Text>
          </View>
        </ScrollView>
      </Modal>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        {this.showModal()}
        <View style={{ flex: 0.25 }}>
          <View style={{ flex: 0.15 }} />
          <View style={styles.logoView}>
            <Image
              source={require("../assets/playpal.png")}
              style={styles.logoImage}
            />
          </View>
        </View>
        <View style={{ flex: 0.45 }}>
          <View style={styles.TextInput}>
            <TextInput
              style={styles.loginBox}
              placeholder="playpal@example.com"
              placeholderTextColor="gray"
              keyboardType="email-address"
              onChangeText={text => {
                this.setState({
                  emailId: text
                });
              }}
            />
            <TextInput
              style={[styles.loginBox, { marginTop: RFValue(15) }]}
              secureTextEntry={true}
              placeholder="Enter Password"
              placeholderTextColor="gray"
              onChangeText={text => {
                this.setState({
                  password: text
                });
              }}
            />
          </View>
          <View style={{ flex: 0.5, alignItems: "center", marginTop: 50 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.userLogin(this.state.emailId, this.state.password);
              }}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.setState({ isModalVisible: true })}
            >
              <Text style={styles.buttonText}>SignUp</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 0.3 }}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.photoImage}
            resizeMode={"stretch"}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#BCB1EC"
  },
  loginBox: {
    width: "80%",
    height: RFValue(50),
    borderWidth: 1.5,
    borderColor: "#ffffff",
    fontSize: RFValue(20),
    paddingLeft: RFValue(10),
    marginTop: 90
  },
  button: {
    width: "80%",
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(25),
    backgroundColor: "#ffff",
    shadowColor: "#000",
    marginBottom: RFValue(10),
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonText: {
    color: "#59A3FF",
    fontWeight: "200",
    fontSize: RFValue(20)
  },
  label: {
    fontSize: RFValue(13),
    color: "#717D7E",
    fontWeight: "bold",
    paddingLeft: RFValue(10),
    marginLeft: RFValue(20)
  },
  formInput: {
    width: "90%",
    height: RFValue(45),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "grey",
    paddingBottom: RFValue(10),
    marginLeft: RFValue(20),
    marginBottom: RFValue(14)
  },
  registerButton: {
    width: "75%",
    height: RFValue(50),
    marginTop: RFValue(20),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(3),
    backgroundColor: "#ef4f71",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: RFValue(10)
  },
  registerButtonText: {
    fontSize: RFValue(23),
    fontWeight: "bold",
    color: "#fff"
  },
  cancelButtonText: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#ef4f71",
    marginTop: RFValue(10)
  },
  scrollview: {
    flex: 1,
    backgroundColor: "#fff"
  },
  signupView: {
    flex: 0.05,
    justifyContent: "center",
    alignItems: "center"
  },
  signupText: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#ef4f71"
  },
  logoView: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10),
  },
  logoImage: {
    width: 350,
    height: 170,
    resizeMode: "stretch",
  },
  TextInput: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center"
  },
  photoImage: {
    width: "100%",
    height: RFValue(220),
    marginBottom: 15
  }
});
