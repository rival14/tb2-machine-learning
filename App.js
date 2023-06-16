import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import theme from './src/theme';
import {ThemeProvider} from '@rneui/themed';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/Home/Home';
import {Camera} from 'react-native-vision-camera';
import {CameraPage} from '@src/screens/Camera/Camera';
import Chat from '@src/screens/Chat/Chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    Camera.getCameraPermissionStatus();
    Camera.getMicrophonePermissionStatus();

    async function setAppId() {
      const appId = await AsyncStorage.getItem('appId');
      if (!appId) {
        await AsyncStorage.setItem('appId', uuid.v4());
      }
    }
    setAppId();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen
              name="Chat"
              component={Chat}
              options={{
                title: 'Chats',
                headerShown: true,
              }}
            />
            <Stack.Screen name="Camera" component={CameraPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
