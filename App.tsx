import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './app/sale/HomeScreen';
import InventoryScreen from './app/InventoryScreen';
import SaleScreen from './app/sale/SaleScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="Sale" component={SaleScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
