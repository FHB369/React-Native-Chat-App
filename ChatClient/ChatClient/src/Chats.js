import React from 'react';
import {View, Text} from 'react-native';
import {bold} from 'ansi-colors';

class ChatsScreen extends React.Component {
  render() {
    return (
      <Text
        style={{
          color: '#f2f2f2',
          fontSize: 30,
          padding: 10,
          paddingLeft: 20,
        }}>
        Chats
      </Text>
    );
  }
}

export default ChatsScreen;
