import {Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';

export default function Menu({image, title, onPress}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <Image source={image} style={styles.cardImage} resizeMode="contain" />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 24,
    borderColor: 'transparent',
    backgroundColor: '#ffffff50',
    padding: 16,
    height: 150,
    margin: 12,
    flex: 1,
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  cardImage: {
    flex: 1,
    width: '70%',
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
