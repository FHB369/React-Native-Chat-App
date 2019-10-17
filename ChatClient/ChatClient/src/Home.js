import React from 'react';
import {SafeAreaView} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {fromRight, zoomOut, fromBottom} from 'react-navigation-transitions';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import io from 'socket.io-client';

import ChatsScreen from './Chats';
import PeoplesScreen from './Peoples';
import SettingsScreen from './Settings';
import Messages from './Messages';

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

    this.state = {
      userName: '',
      userId: '',
      userPhotoUrl: '',
    };
  }

  componentDidMount() {}

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#222'}}>
        <HomeNavigator screenProps={{rootNavigation: this.props.navigation}} />
      </SafeAreaView>
    );
  }
}

const LandingNavigator = createStackNavigator(
  {
    Landing: Home,
    Message: Messages,
  },
  {
    initialRouteName: 'Landing',
    headerMode: 'none',
    transitionConfig: () => fromRight(),
  },
);

const HomeScreen = createAppContainer(LandingNavigator);

export default HomeScreen;
