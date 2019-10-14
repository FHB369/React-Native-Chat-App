import React from 'react';
import {View, Text, Image, Switch, TouchableOpacity} from 'react-native';
import {
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {StackActions, NavigationActions} from 'react-navigation';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      userId: '',
      userPhotoUrl: 'http://civilcode.ge/images/2/24/Blank-avatar.png',
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
          console.log(result);
          this.setState({
            userId: result.id,
            userName: result.name,
            userPhotoUrl: result.picture.data.url,
          });
        }
      },
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  }

  resetAction = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'Login',
      }),
    ],
  });

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
          Settings
        </Text>
        <View
          style={{
            paddingHorizontal: '7%',
            marginBottom: '18%',
            paddingBottom: '1.5%',
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
                uri: this.state.userPhotoUrl,
              }}
              style={{
                width: 60,
                height: 60,
                borderRadius: 70,
                borderColor: '#333',
                borderWidth: 2,
              }}
            />
            <View
              style={{
                position: 'absolute',
                backgroundColor: '#46CF76',
                width: 18,
                height: 18,
                left: 50,
                top: 52,
                borderRadius: 100,
                borderColor: '#222',
                borderWidth: 3,
              }}
            />
            <View
              style={{
                flex: 2,
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
                {this.state.userName}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Cairo-Light',
                  color: 'lightgrey',
                }}>
                {'@' + this.state.userId}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <Text
            style={{
              marginLeft: '7%',
              fontSize: 22,
              fontFamily: 'Cairo-SemiBold',
              color: '#ccc',
              paddingVertical: '3%',
            }}>
            Dark Theme
          </Text>
          <Switch
            style={{
              position: 'absolute',
              alignSelf: 'flex-end',
              paddingVertical: '5%',
              right: '5%',
            }}
            value={true}
          />
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              LoginManager.logOut();
              this.props.screenProps.rootNavigation.navigate('Login');
              // console.log(this.props);
            }}>
            <Text
              style={{
                width: '100%',
                marginLeft: '7%',
                fontSize: 22,
                fontFamily: 'Cairo-SemiBold',
                color: 'tomato',
                paddingVertical: '3%',
              }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default SettingsScreen;
