/* eslint-disable react/react-in-jsx-scope */
import {styles} from '@src/screens/Chat/styles';
import dayjs from 'dayjs';
import {Text, View} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const BubbleMessage = ({item}) => {
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
            <Text style={{color: 'black'}}>{item.text}</Text>
          </View>
        </View>
        <Text style={{marginLeft: 40}}>
          {dayjs(item.createdAt).format('HH:MM')}
        </Text>
      </View>
    </View>
  );
};

export default BubbleMessage;
