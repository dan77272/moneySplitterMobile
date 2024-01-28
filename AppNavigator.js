import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './HomeScreen';
import UserPage from './UserPage';

const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="UserPage" component={UserPage} options={{headerShown: false}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  }

export default AppNavigator;