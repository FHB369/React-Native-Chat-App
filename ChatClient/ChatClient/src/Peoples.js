import React from 'react';
import {View, Text, ScrollView, Image} from 'react-native';

class PeoplesScreen extends React.Component {
  render() {
    return (
      <View>
        <Text
          style={{
            color: '#f4f4f4',
            fontSize: 36,
            padding: '5%',
            paddingLeft: '7%',
            fontFamily: 'Cairo-Regular',
          }}>
          Peoples
        </Text>
        <View>
          <ScrollView
            style={{
              paddingHorizontal: '7%',
              marginBottom: '18%',
              paddingBottom: '1.5%',
            }}>
            {[...Array(6)].map((x, i) => (
              <View
                style={{
                  flex: 2,
                  flexDirection: 'row',
                  marginVertical: '2%',
                  paddingVertical: '4%',
                  borderRadius: 10,
                }}>
                <Image
                  source={{
                    uri:
                      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 70,
                    borderColor: '#444',
                    borderWidth: 2,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: '#46CF76',
                    width: 15,
                    height: 15,
                    left: 30,
                    top: 40,
                    borderRadius: 100,
                    borderColor: '#222',
                    borderWidth: 2,
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    marginHorizontal: '5%',
                    marginTop: '1%',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Cairo-SemiBold',
                      color: '#f2f2f2',
                    }}>
                    Name
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default PeoplesScreen;
