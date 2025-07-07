import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './android/app/src/main/sale/HomeScreen';
import InventoryScreen from './android/app/src/main/InventoryScreen';
import SaleScreen from './android/app/src/main/sale/SaleScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add Inventory" component={InventoryScreen} />
        <Stack.Screen name="Sale" component={SaleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
