/* eslint-disable react-native/no-inline-styles */
/** Messages screen for broadcast messages */

//importing libraries
import React from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  ToastAndroid,
  Text,
  BackHandler,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  Composer,
} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import io from 'socket.io-client';

class Broadcast extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      userName: '',
      userPhoto: '',
      messages: [],
    };
  }

  //styling chat bubbles
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

  //styling input bar
  renderInputToolbar = props => {
    return (
      <>
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: '#111',
            borderTopWidth: 0,
            marginHorizontal: 10,
            marginLeft: '12%',
            borderRadius: 80,
          }}
          textInputProps={{
            style: {
              color: '#fff',
              flex: 1,
              alignItems: 'center',
              paddingHorizontal: 20,
            },
            multiline: false,
            returnKeyType: 'go',
            onSubmitEditing: () => {
              if (props.text && props.onSend) {
                let text = props.text;
                props.onSend({text: text.trim()}, true);
              }
            },
          }}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            marginLeft: '4%',
            marginBottom: '1%',
            bottom: 0,
          }}
          onPress={this.handleChoosePhoto}>
          <Icon
            name="ios-analytics"
            style={{
              color: '#46CF76',
            }}
            size={32}
          />
        </TouchableOpacity>
      </>
    );
  };

  //styling send button
  renderSend = props => {
    return (
      <>
        <Send {...props}>
          <Icon
            name="ios-arrow-dropright-circle"
            style={{
              color: '#46CF76',
              marginRight: '0%',
              marginBottom: '30%',
            }}
            size={32}
          />
        </Send>
      </>
    );
  };

  //choose photo from gallery or camera
  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response};

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        console.log('Image Uri: ');
        console.log(source);
        let axiosConfig = {
          headers: {
            Authorization: 'Client-ID ead116aab30174c',
          },
          timeout: 8000,
        };

        let formData = new FormData();
        formData.append('image', source.uri);
        ToastAndroid.show('Uploading...', ToastAndroid.LONG);

        //upload image to imgur
        axios
          .post('https://api.imgur.com/3/image', formData, axiosConfig)
          .then(res => {
            if (res.status === 200) {
              console.log(res.status);
              let {data} = res;
              // this.setState({imageURL: data.data.link});
              const id = this.state.messages.length + 1;
              let imageMsg = [
                {
                  _id: id,
                  text: '',
                  createdAt: new Date(),
                  user: {
                    _id: this.state.userId,
                    name: this.state.userName,
                    avatar: this.state.userPhoto,
                  },
                  image: data.data.link,
                },
              ];

              //send image
              this.onSend(imageMsg);
              imageMsg = [];
            } else {
              ToastAndroid.show(
                'Uploading failed. Try again',
                ToastAndroid.SHORT,
              );
            }
          });
      }
    });
  };

  componentDidMount() {
    //handling physical back press
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress,
    );

    this.setState({
      userId: this.props.navigation.getParam('senderId', ''),
      userName: this.props.navigation.getParam('senderName', ''),
      userPhoto: this.props.navigation.getParam('senderPhoto', ''),
    });

    //get previous messages
    this.getMessages();

    //initializing sockets
    this.socket = io('https://frozen-citadel-48963.herokuapp.com/chatsocket');
    this.socket.connect();
    this.socket.on('incommingMessage', () => {
      console.log('called');
      this.getMessages();
    });
  }

  getMessages = async () => {
    try {
      let response = await axios.get(
        'https://frozen-citadel-48963.herokuapp.com' + '/broadcast',
      );
      if (response.status === 200) {
        let broadcasts = response.data.reverse();
        this.setState(previousState => ({
          messages: GiftedChat.append([], broadcasts),
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  handleBackPress = () => {
    this.props.navigation.goBack(); // works best when the goBack is async
    return true;
  };

  componentWillMount() {}

  async onSend(messages = []) {
    await this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    //notify new message
    this.socket.emit('newMessage', 'sent');
    // console.log(messages[0]);
    try {
      let formData = messages[0];
      let response = await axios.post(
        'https://frozen-citadel-48963.herokuapp.com' + '/broadcast/',
        formData,
      );
      if (response.status === 200) {
        console.log(response.data);
        this.socket.emit('newMessage', 'sent');
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const {navigation} = this.props;
    return (
      <>
        <StatusBar backgroundColor="#111" barStyle="light-content" />

        <View style={{backgroundColor: '#222', flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              height: '8%',
              width: '100%',
              backgroundColor: '#111',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: '4%',
            }}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Icon
                name="ios-arrow-back"
                size={32}
                style={{color: '#46CF76'}}
              />
            </TouchableOpacity>
            <Text
              name="ios-home"
              style={{
                flex: 1,
                fontSize: 18,
                color: '#f2f2f2',
                textAlign: 'center',
              }}>
              Broadcast
            </Text>
            <Icon name="ios-home" size={32} style={{opacity: 0, flex: 1}} />
          </View>
          <GiftedChat
            listViewProps={{
              style: {
                backgroundColor: '#222',
              },
            }}
            renderUsernameOnMessage={true}
            alwaysShowSend={true}
            messages={this.state.messages}
            renderBubble={this.renderBubble}
            renderInputToolbar={this.renderInputToolbar}
            renderSend={this.renderSend}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: this.state.userId,
              name: this.state.userName,
              avatar: this.state.userPhoto,
            }}
          />
          <View
            style={{
              height: '1%',
              width: '100%',
            }}
          />
        </View>
      </>
    );
  }
}

export default Broadcast;
