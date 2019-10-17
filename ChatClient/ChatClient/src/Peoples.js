import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import {GraphRequest, GraphRequestManager} from 'react-native-fbsdk';

class PeoplesScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePeoples: [],
      inactivePeoples: [],
    };
  }

  componentDidMount() {
    const infoRequest = new GraphRequest(
      '/me?fields=id,name,picture.height(480)',
      null,
      (error, result) => {
        if (error) {
          console.log('Error fetching data: ' + error.toString());
        } else {
          // console.log(result);
          var self = this;
          axios
            .post('http://10.100.94.164:4000/login/', {
              name: result.name,
              id: result.id,
              photo: result.picture.data.url,
            })
            .then(function(response) {
              console.log(response.data);
              const socket = io('http://10.100.94.164:4000', {
                transports: ['websocket'],
                jsonp: false,
              });
              socket.connect();
              socket.on('connect', () => {
                socket.emit('storeClientInfo', {
                  customId: response.data.id,
                });
              });
              socket.on('update', () => {
                axios
                  .get('http://10.100.94.164:4000/users/active')
                  .then(response => {
                    self.setState({
                      activePeoples: response.data,
                    });
                  })
                  .catch(error => {
                    console.log(error);
                  });
              });
            })
            .catch(function(error) {
              console.log(error);
            });
        }
      },
    );

    new GraphRequestManager().addRequest(infoRequest).start();
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
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default PeoplesScreen;
