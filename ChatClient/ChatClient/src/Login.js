import React from 'react';
import {View, SafeAreaView} from 'react-native';
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
    AccessToken.getCurrentAccessToken().then(data => {
      if (data !== null) {
        this.setState({
          visible: 0,
        });
      } else {
        this.setState({
          visible: 1,
        });
      }
    });
  }

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
            justifyContent: 'center',
            opacity: this.state.visible,
          }}>
          <LoginButton
            style={{
              width: '70%',
              height: '4%',
              marginHorizontal: '15%',
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
                  this.props.navigation.dispatch(this.resetAction);
                });
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
