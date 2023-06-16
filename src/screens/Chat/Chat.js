import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {View, TextInput, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from './styles';
import BubbleMessage from '@src/components/BubbleMessage';
import EventSource from 'react-native-sse';
import queryString from 'query-string';
import {useMutation, useQuery} from '@tanstack/react-query';
import api from '@src/utils/api';
import {DialogLoading} from '@rneui/base/dist/Dialog/Dialog.Loading';
import IonIcon from 'react-native-vector-icons/Ionicons';

const Chat = ({navigation}) => {
  const [askLoading, setAskLoading] = useState(false);
  const [bool, setBool] = useState(false);
  const [reply, setReply] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const bottom = useRef();
  const [appId, setAppId] = useState('');
  const {isLoading} = useQuery({
    queryKey: ['chats', appId],
    queryFn: () => api.chats(appId),
    onSuccess: res => {
      if (res.length > 0) {
        setChatMessages(res);
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!appId,
  });
  const {mutate: askQuestion} = useMutation({
    mutationFn: async () => {
      if (reply) {
        setAskLoading(true);
        await api.createChats({
          appId: appId,
          text: reply,
          me: true,
          complete: true,
        });
      }
    },
    onSuccess: res => {
      if (reply) {
        setBool(prev => !prev);
        setChatMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            text: reply,
            me: true,
            complete: true,
            createdAt: new Date(),
          },
        ]);
      }
    },
  });

  const {mutate: sendAnswer} = useMutation({
    mutationFn: async () => {
      await api.createChats({
        appId: appId,
        text: chatMessages[chatMessages.length - 1].text,
        me: false,
        complete: true,
      });
    },
  });

  const handleMessage = useCallback(
    (text, isComplete) => {
      if (!isComplete) {
        setChatMessages(prev => {
          if (prev[prev.length - 1]?.complete) {
            return [
              ...prev,
              {
                id: prev.length + 1,
                text: text,
                me: false,
                complete: isComplete,
                createdAt: new Date(),
              },
            ];
          } else {
            // console.log(prev[prev.length - 1])
            prev[prev.length - 1]?.complete ? null : prev.pop();
            return [
              ...prev,
              {
                id: prev.length + 1,
                text: text,
                me: false,
                complete: isComplete,
                createdAt: new Date(),
              },
            ];
          }
        });
      } else {
        sendAnswer();
      }
    },
    [sendAnswer],
  );

  useEffect(() => {
    if (reply) {
      let assistantOutput = '';
      function createQueryParam(conversation) {
        const encodedConversation = JSON.stringify(conversation);
        return queryString.stringify({q: encodedConversation});
      }

      let conversationHistory = [];
      conversationHistory.push({role: 'user', content: reply});
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

      const listener = event => {
        if (event.type === 'message') {
          const message = event.data.toString('utf-8');
          const msgMatch = /"msg":"(.*?)"/.exec(message);
          const numMatch = /\[DONE\] (\d+)/.exec(message);

          if (numMatch) {
            handleMessage('', true);
            conversationHistory.push({
              role: 'assistant',
              content: assistantOutput.trim(),
            });
            return es.close();
          }

          if (JSON.parse(message)?.msg[0] == ' ') {
            assistantOutput += ' ' + msgMatch[1].trim();
          } else {
            assistantOutput += msgMatch[1].trim();
          }
          handleMessage(assistantOutput, false);
        } else if (event.type === 'close') {
          setReply('');
          setAskLoading(false);
          // bottom.current?.scrollToEnd({animated: false, bottom: -30});
        }
      };

      es.addEventListener('message', listener);
      es.addEventListener('close', listener);
      es.addEventListener('open', listener);
      es.addEventListener('error', listener);

      return () => {
        es.removeAllEventListeners();
        es.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bool, handleMessage]);

  useEffect(() => {
    async function getAppId() {
      setAppId(await AsyncStorage.getItem('appId'));
    }
    getAppId();
  }, []);

  //👇🏻 Sets the header title to the name chatroom's name
  useLayoutEffect(() => {
    navigation.setOptions({title: 'ChatGPT'});
  }, [navigation]);

  return (
    <View style={styles.messagingscreen}>
      <View
        style={[
          styles.messagingscreen,
          {paddingVertical: 15, paddingHorizontal: 10},
        ]}>
        {chatMessages[0] || !isLoading ? (
          <FlatList
            ref={bottom}
            data={chatMessages}
            renderItem={({item}) => <BubbleMessage item={item} />}
            keyExtractor={(item, index) => index}
            inverted
            contentContainerStyle={{flexDirection: 'column-reverse'}}
          />
        ) : (
          <DialogLoading loadingStyle={{flex: 1}} />
        )}
      </View>

      <View style={styles.messaginginputContainer}>
        <View style={styles.messaginginput}>
          <TextInput
            style={styles.inputMessage}
            onChangeText={value => setReply(value)}
            value={reply}
            placeholder="Mau tanya apa?"
            placeholderTextColor={'#aaa'}
          />
          <TouchableOpacity
            disabled={askLoading}
            style={styles.messagingInputIcon}
            onPress={askQuestion}>
            <IonIcon name="send" size={30} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(Chat);
