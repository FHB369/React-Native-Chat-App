import React from 'react';
import {View, Text} from 'react-native';

class SettingsScreen extends React.Component {
  render() {
    return (
      <Text
        style={{
          color: '#f4f4f4',
          fontSize: 36,
          padding: '5%',
          paddingLeft: '10%',
          fontFamily: 'Cairo-Regular',
        }}>
        Settings
      </Text>
    );
  }
}

export default SettingsScreen;
