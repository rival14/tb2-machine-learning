import {View, ImageBackground} from 'react-native';
import React from 'react';
import bg from '@src/assets/images/bg.jpg';
import chatgpt from '@src/assets/images/chatgpt.png';
import camera from '@src/assets/images/camera.png';
import styles from './styles';
import Menu from '@src/components/Menu';
import {useNavigation} from '@react-navigation/native';
import { Camera } from 'react-native-vision-camera';

const Home = () => {
  const {navigate} = useNavigation();
  // console.log(devices['back'])

  const menus = [
    {
      id: 1,
      image: chatgpt,
      title: 'ChatGPT',
      onPress: () => {
        navigate('Chat');
      },
    },
    {
      id: 2,
      image: camera,
      title: 'Camera',
      onPress: async () => {
        await Camera.requestCameraPermission();
        await Camera.requestMicrophonePermission();
        navigate('Camera');
      },
    },
  ];
  return (
    <View style={styles.container}>
      <ImageBackground source={bg} resizeMode="cover" style={styles.image}>
        <View style={styles.menu}>
          {menus.map(item => (
            <Menu
              key={item.id}
              image={item.image}
              title={item.title}
              onPress={item.onPress}
            />
          ))}
        </View>
      </ImageBackground>
    </View>
  );
};

export default React.memo(Home);
