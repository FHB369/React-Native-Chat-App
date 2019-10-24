/** Home Screen of the app */

//importing libraries
import React from 'react';
import {SafeAreaView, ActivityIndicator} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {fromRight, zoomIn, fromBottom} from 'react-navigation-transitions';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import io from 'socket.io-client';
import {GraphRequest, GraphRequestManager} from 'react-native-fbsdk';

//importing screens
import ChatsScreen from './Chats';
import PeoplesScreen from './Peoples';
import SettingsScreen from './Settings';
import Messages from './Messages';
import Broadcast from './Broadcast';

//create a tab navigator for homescreen
const TabNavigator = createMaterialTopTabNavigator(
  {
    Chats: {
      screen: ChatsScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-chatboxes" color={tintColor} size={28} />
        ),
      },
    },
    Peoples: {
      screen: PeoplesScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-contacts" color={tintColor} size={28} />
        ),
      },
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="ios-switch" color={tintColor} size={28} />
        ),
      },
    },
  },
  {
    swipeEnabled: true,
    initialRouteName: 'Chats',
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      style: {
        backgroundColor: '#000',
        paddingtop: 10,
        paddingBottom: 10,
        paddingLeft: 2,
        paddingRight: 2,
      },
      indicatorStyle: {
        height: 0,
      },
      activeTintColor: '#46CF76',
      inactiveTintColor: '#444',
      pressColor: 'rgba(181,235,200,0.1)',
    },
  },
);

const HomeNavigator = createAppContainer(TabNavigator);

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {userName: '', userId: '', userPhotoUrl: ''};
  }

  componentWillMount() {
    // console.log(this.props.screenProps.homeNavigation);
    //retrieve informations from Facebook
    const infoRequest = new GraphRequest(
      '/me?fields=id,name,picture.height(480)',
      null,
      (error, result) => {
        if (error) {
          console.log('Error fetching data: ' + error.toString());
        } else {
          var self = this;
          //login user
          axios
            .post('https://frozen-citadel-48963.herokuapp.com' + '/login/', {
              name: result.name,
              id: result.id,
              photo: result.picture.data.url,
            })
            .then(async function(response) {
              await self.setState({
                userId: response.data.id,
                userName: response.data.name,
                userPhotoUrl: response.data.photo,
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
      <SafeAreaView style={{flex: 1, backgroundColor: '#222'}}>
        {this.state.userId ? (
          <HomeNavigator
            screenProps={{
              rootNavigation: this.props.screenProps.homeNavigation,
              homeNavigation: this.props.navigation,
              user: this.state.userId,
              userName: this.state.userName,
              userPhoto: this.state.userPhotoUrl,
            }}
          />
        ) : (
          <ActivityIndicator size="large" color="#46CF76" style={{flex: 1}} />
        )}
      </SafeAreaView>
    );
  }
}

//Create a navigator to go to message screen from home
const LandingNavigator = createStackNavigator(
  {
    Landing: Home,
    Message: Messages,
    Broadcast: Broadcast,
  },
  {
    initialRouteName: 'Landing',
    headerMode: 'none',
    transitionConfig: () => zoomIn(),
  },
);

const HomeMessageNav = createAppContainer(LandingNavigator);

class HomeScreen extends React.Component {
  render() {
    return (
      <HomeMessageNav screenProps={{homeNavigation: this.props.navigation}} />
    );
  }
}

export default HomeScreen;
