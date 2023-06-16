import AsyncStorage from '@react-native-async-storage/async-storage';
import {Input} from '@rneui/base';
import {Icon} from '@rneui/themed';
import api from '@src/utils/api';
import {useMutation, useQuery} from '@tanstack/react-query';
import axios from 'axios';
import queryString from 'query-string';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Chatty} from 'react-native-chatty';
import EventSource from 'react-native-sse';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Halo aku adalah Kampus ChatGPT!',
      me: false,
      createdAt: new Date(),
    },
  ]);
  const [appId, setAppId] = useState('');
  const reply = useRef();
  console.log(appId);
  const {refetch} = useQuery({
    queryKey: ['chats'],
    queryFn: () => api.chats(appId),
    onSuccess: res => {
      if (res.length > 0) {
        setMessages(res);
      }
    },
  });
  const {mutate: askQuestion} = useMutation({
    mutationFn: async () => {
      await api.createChats({
        appId: appId,
        text: reply.current,
        me: true,
      });

      function createQueryParam(conversation) {
        const encodedConversation = JSON.stringify(conversation);
        return queryString.stringify({q: encodedConversation});
      }

      let conversationHistory = [];
      conversationHistory.push({role: 'user', content: reply.current});
      const queryParam = createQueryParam(conversationHistory);
      const url = `https://openai.a2hosted.com/chat?${queryParam}`;
      const headers = {
        authority: 'openai.a2hosted.com',
        accept: 'text/event-stream',
        'accept-language': 'en-US,en;q=0.9,id;q=0.8,ja;q=0.7',
        'cache-control': 'no-cache',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.0.0',
      };

      return await axios
        .get(url, {headers: headers, responseType: 'stream'})
        .then(response => {
          let assistantOutput = '';
          console.log(response.data);

          // response.data.on('data', chunk => {
          //   const message = chunk.toString('utf-8');
          //   const msgMatch = /"msg":"(.*?)"/.exec(message);
          //   const numMatch = /\[DONE\] (\d+)/.exec(message);

          //   if (msgMatch) {
          //     assistantOutput += ' ' + msgMatch[1].trim().replace(/\n/g, ' ');
          //   }

          //   if (numMatch) {
          //     console.log('Assistant:', assistantOutput.trim());
          //     console.log('Remaining Completion:', numMatch[1]);
          //     conversationHistory.push({
          //       role: 'assistant',
          //       content: assistantOutput.trim(),
          //     });
          //   }
          // });
        })
        .catch(error => {
          console.error(error);
        });
      // return await axios.post(
      //   'https://free.churchless.tech/v1/chat/completions',
      //   {
      //     messages: [
      //       {
      //         role: 'user',
      //         content: reply.current,
      //       },
      //     ],
      //   },
      // );
    },
    onSuccess: res => {
      // api.createChats({
      //   appId: appId,
      //   text: res.choices[0].message.content,
      //   me: false,
      // });
      refetch();
    },
  });

  useEffect(() => {
    console.log('run');
    function createQueryParam(conversation) {
      const encodedConversation = JSON.stringify(conversation);
      return queryString.stringify({q: encodedConversation});
    }

    let conversationHistory = [];
    conversationHistory.push({role: 'user', content: 'Halo!'});
    const queryParam = createQueryParam(conversationHistory);
    const url = new URL(`https://openai.a2hosted.com/chat?${queryParam}`);

    const es = new EventSource(url, {
      headers: {
        authority: 'openai.a2hosted.com',
        accept: 'text/event-stream',
        'accept-language': 'en-US,en;q=0.9,id;q=0.8,ja;q=0.7',
        'cache-control': 'no-cache',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.0.0',
      },
    });

    alert(JSON.stringify(es));
    const listener = event => {
      if (event.type === 'open') {
        console.log('Open SSE connection.');
      } else if (event.type === 'message') {
        const res = JSON.parse(event.data);
        console.log(res);
      } else if (event.type === 'error') {
        console.error('Connection error:', event.message);
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error);
      }
    };

    es.addEventListener('open', listener);
    es.addEventListener('message', listener);
    es.addEventListener('error', listener);

    return () => {
      es.removeAllEventListeners();
      es.close();
    };
  }, []);

  useEffect(() => {
    async function getAppId() {
      setAppId(await AsyncStorage.getItem('appId'));
    }
    getAppId();
  }, []);

  return (
    <Chatty
      messages={messages}
      renderHeader={props => <View />}
      renderTypingBubble={() => <Text>Custom View (Typing...)</Text>}
      bubbleProps={null}
      renderFooter={props => (
        <View style={{marginTop: '10%'}}>
          <Input
            inputContainerStyle={{
              paddingHorizontal: 16,
              borderWidth: 1,
              borderRadius: 18,
            }}
            rightIcon={
              <TouchableOpacity onPress={askQuestion}>
                <Icon name="send" size={28} />
              </TouchableOpacity>
            }
            placeholder="Mau tanya apa?"
            multiline
            onChangeText={value => (reply.current = value)}
          />
        </View>
      )}
    />
  );
};

export default React.memo(Chat);
