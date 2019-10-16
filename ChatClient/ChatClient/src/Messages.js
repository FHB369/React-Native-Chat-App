import React from 'react';
import {View, StatusBar} from 'react-native';
import {Header} from 'react-native-elements';
import {GiftedChat, Bubble, InputToolbar, Send} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';

class Messages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };
  }

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: '#46CF76',
          },
        }}
      />
    );
  };

  renderInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: '#111',
          borderTopWidth: 0,
          marginHorizontal: 10,
          borderRadius: 80,
        }}
        textStyle={{
          color: '#fff',
        }}
      />
    );
  };

  renderSend = props => {
    return (
      <Send {...props}>
        <Icon
          name="ios-arrow-dropright-circle"
          style={{
            color: '#46CF76',
            marginRight: '0%',
            marginBottom: '20%',
          }}
          size={32}
        />
      </Send>
    );
  };

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    return (
      <>
        <StatusBar backgroundColor="#111" barStyle="light-content" />

        <View style={{backgroundColor: '#222', flex: 1}}>
          <View
            style={{
              height: '8%',
              width: '100%',
              backgroundColor: '#111',
            }}></View>
          <GiftedChat
            listViewProps={{
              style: {
                backgroundColor: '#222',
              },
            }}
            renderUsernameOnMessage={true}
            isAnimated={true}
            alwaysShowSend={true}
            messages={this.state.messages}
            renderBubble={this.renderBubble}
            renderInputToolbar={this.renderInputToolbar}
            renderSend={this.renderSend}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: 1,
            }}
          />
          <View
            style={{
              height: '1%',
              width: '100%',
            }}></View>
        </View>
      </>
    );
  }
}

export default Messages;
