import React from 'react';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';

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
            color: 'yellow',
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: 'red',
          },
        }}
      />
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
      <GiftedChat
        style={{backgroundColor: '#222'}}
        messages={this.state.messages}
        renderBubble={this.renderBubble}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    );
  }
}

export default Messages;
