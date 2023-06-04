import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 100,
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
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
  transparent: {
    backgroundColor: '#DAD3CD30',
  },
});

export default styles;
