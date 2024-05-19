// Home.jsx
import {API_KEY, SECRET_KEY} from '@env';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import base64 from 'react-native-base64';
import socketService from '../socketServer';

const Home = () => {
  const [accessToken, setAccessToken] = useState('');
  const navigation = useNavigation();

  const authenticate = async () => {
    try {
      const authString = `h6hjf3AgOvfzNapLZytPCryT4rSmaaptlw46AnJDNWJpNW79:2GX0Rd0PKOURtQlaH46WOZZsypTJgPqVdSseRiXBGyt8nVX2f1cVezVTwChNL3wu`;
      const encoded = base64.encode(authString);

      const res = await fetch('https://api.hume.ai/oauth2-cc/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${encoded}`,
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
        }).toString(),
      });

      const data = await res.json();
      const accessToken = data?.access_token;
      console.log('🚀 ~ authenticate ~ accessToken:', accessToken);
      setAccessToken(accessToken);
      // return;
      socketService.initializeSocket(accessToken);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleStartConversation = () => {
    authenticate();
    navigation.navigate('Recorder');
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Pressable style={styles.button} onPress={handleStartConversation}>
        <Text style={styles.text}>Start Conversation</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default Home;
