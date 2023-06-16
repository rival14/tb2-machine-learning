import Clipboard from '@react-native-clipboard/clipboard';
import {styles} from '@src/screens/Chat/styles';
import React from 'react';
import {Text, ToastAndroid, View} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const BubbleMessage = ({item}) => {
  const copyToClipboard = text => {
    Clipboard.setString(text);
    ToastAndroid.show('Copied to clipboard!', ToastAndroid.BOTTOM);
  };
  return (
    <View>
      <View
        style={
          !item.me
            ? styles.mmessageWrapper
            : [styles.mmessageWrapper, {alignItems: 'flex-end'}]
        }>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <IonIcon
            name="person-circle-outline"
            size={30}
            color="black"
            style={styles.mvatar}
          />
          <View
            style={
              !item.me
                ? styles.mmessage
                : [styles.mmessage, {backgroundColor: 'rgb(194, 243, 194)'}]
            }>
            <Text style={{color: 'black'}} selectable>
              {item.text}
            </Text>
          </View>
          {!item.me && (
            <IonIcon
              name="clipboard-outline"
              size={22}
              color="#aaa"
              style={styles.mvatar}
              onPress={() => copyToClipboard(item.text)}
            />
          )}
        </View>
        {/* <Text style={{marginLeft: 40,}}>
          {dayjs(item.createdAt).format('HH:MM')}
        </Text> */}
      </View>
    </View>
  );
};

export default React.memo(BubbleMessage);
