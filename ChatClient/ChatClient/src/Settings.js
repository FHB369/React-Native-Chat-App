import React from 'react';
import {View, Text} from 'react-native';

class SettingsScreen extends React.Component {
  render() {
    return (
      <Text
        style={{
          color: '#f2f2f2',
          fontSize: 30,
          padding: 10,
          paddingLeft: 20,
        }}>
        Settings
      </Text>
    );
  }
}

export default SettingsScreen;
