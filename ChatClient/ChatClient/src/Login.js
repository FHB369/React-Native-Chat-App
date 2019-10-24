/* eslint-disable react-native/no-inline-styles */
/** Login Screen of the app */

//importing libraries
import React from 'react';
import {View, SafeAreaView, Text} from 'react-native';
import {LoginButton, AccessToken} from 'react-native-fbsdk';
import {StackActions, NavigationActions} from 'react-navigation';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: 0,
    };
  }

  componentDidMount() {
    //checking if the user is already logged in
    AccessToken.getCurrentAccessToken().then(data => {
      if (data !== null) {
        this.setState({
          visible: 0,
        });
        //divert to home
        this.props.navigation.navigate('Home');
      } else {
        this.setState({
          visible: 1,
        });
      }
    });
  }

  //reset navigation stack
  resetAction = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'Home',
      }),
    ],
  });

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#222'}}>
        <View
          style={{
            flex: 1,
            alignContent: 'stretch',
            justifyContent: 'space-between',
            opacity: this.state.visible,
          }}>
          <Text
            style={{
              width: '100%',
              color: '#46CF76',
              fontSize: 122,
              textAlign: 'center',
              fontFamily: 'Cairo-SemiBold',
              marginTop: '20%',
              opacity: 0.8,
            }}>
            #Chats
          </Text>
          <LoginButton
            style={{
              width: '70%',
              height: '4%',
              marginHorizontal: '15%',
              marginBottom: '30%',
            }}
            onLoginFinished={(error, result) => {
              if (error) {
                console.log('login has error: ' + result.error);
              } else if (result.isCancelled) {
                console.log('login is cancelled.');
              } else {
                AccessToken.getCurrentAccessToken().then(data => {
                  this.setState({
                    visible: 0,
                  });
                });
                this.props.navigation.navigate('Home');
              }
            }}
            onLogoutFinished={() => console.log('logout.')}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default LoginScreen;
