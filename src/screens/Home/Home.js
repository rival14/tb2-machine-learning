import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import bg from '@src/assets/images/bg.jpg';
import chatgpt from '@src/assets/images/chatgpt.png';
import camera from '@src/assets/images/camera.png';
import styles from './styles';
import Menu from '@src/components/Menu';

const Home = () => {
  const menus = [
    {
      image: chatgpt,
      title: 'Kampus ChatGPT',
      onPress: () => {},
    },
    {
      image: camera,
      title: 'Camera',
      onPress: () => {},
    },
  ];
  return (
    <View style={styles.container}>
      <ImageBackground source={bg} resizeMode="cover" style={styles.image}>
        <View style={styles.menu}>
          {menus.map(item => (
            <Menu
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
