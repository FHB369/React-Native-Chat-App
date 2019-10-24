/* eslint-disable react-native/no-inline-styles */
/** Active peoples tab in Home Screen */

//importing libraries
import React from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

class PeoplesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      userName: '',
      userPhoto: '',
      activePeoples: [],
      inactivePeoples: [],
    };
  }

  componentDidMount() {
    //get current user's info from props
    this.setState({
      userId: this.props.screenProps.user,
      userName: this.props.screenProps.userName,
      userPhoto: this.props.screenProps.userPhoto,
    });

    //initialize the sockets
    this.socket = io('https://frozen-citadel-48963.herokuapp.com');
    this.socket.connect();
    this.socket.on('connect', () => {
      //notify new user
      this.socket.emit('storeClientInfo', {
        customId: this.props.screenProps.user,
      });
      axios
        .get('https://frozen-citadel-48963.herokuapp.com' + '/users/active')
        .then(response => {
          let actives = [];
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].id == this.state.userId) {
            } else {
              actives.push(response.data[i]);
            }
          }
          this.setState({
            activePeoples: actives,
          });
        })
        .catch(error => {
          console.log(error);
        });
    });
    this.socket.on('update', () => {
      console.log('Ceeeeeeeeeeee');
      axios
        .get('https://frozen-citadel-48963.herokuapp.com' + '/users/active')
        .then(response => {
          let actives = [];
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].id == this.state.userId) {
            } else {
              actives.push(response.data[i]);
            }
          }
          this.setState({
            activePeoples: actives,
          });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  render() {
    return (
      <View>
        <Text
          style={{
            color: '#f4f4f4',
            fontSize: 36,
            padding: '5%',
            paddingLeft: '7%',
            fontFamily: 'Cairo-Regular',
          }}>
          Peoples
        </Text>
        <View>
          <ScrollView
            style={{
              paddingHorizontal: '7%',
              marginBottom: '18%',
              paddingBottom: '1.5%',
            }}>
            {this.state.activePeoples.map(active => (
              <TouchableOpacity
                onPress={() => {
                  this.props.screenProps.homeNavigation.push('Message', {
                    userName: active.name,
                    userId: active.id,
                    userPhoto: active.photo,
                    senderId: this.state.userId,
                    senderName: this.state.userName,
                    senderPhoto: this.state.userPhoto,
                  });
                  // console.log(this.props);
                }}>
                <View
                  style={{
                    flex: 2,
                    flexDirection: 'row',
                    marginVertical: '2%',
                    paddingVertical: '4%',
                    borderRadius: 10,
                  }}>
                  <Image
                    source={{
                      uri: active.photo,
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 70,
                      borderColor: '#444',
                      borderWidth: 2,
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      backgroundColor: '#46CF76',
                      width: 15,
                      height: 15,
                      left: 30,
                      top: 40,
                      borderRadius: 100,
                      borderColor: '#222',
                      borderWidth: 2,
                    }}
                  />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      marginHorizontal: '5%',
                      marginTop: '1%',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'Cairo-SemiBold',
                        color: '#f2f2f2',
                      }}>
                      {active.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default PeoplesScreen;
