import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';

const InventoryScreen = () => {
  const [supplier, setSupplier] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [orderDate, setOrderDate] = useState(today);
  const [productImage, setProductImage] = useState<any>(null);
  const [productCode, setProductCode] = useState('');
  const [batchCode, setBatchCode] = useState('');

  const generateCodes = () => {
    const dateCode = orderDate.replace(/-/g, '');
    const batch = `${supplier.toUpperCase().slice(0, 3)}${dateCode}`;
    const product = `${batch}-P${Math.floor(Math.random() * 1000)}`;
    setBatchCode(batch);
    setProductCode(product);

    // Add to Firebase Firestore
    firestore()
      .collection('inventory')
      .doc(product) // custom ID
      .set({
        batchCode: batch,
        productCode: product,
        supplier: supplier,
        orderDate: orderDate,
        timestamp: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log('✅ QR data added to Firestore');
      })
      .catch(error => {
        console.error('❌ Error adding to Firestore:', error);
      });
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setProductImage(result.assets[0]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Inventory Entry</Text>
      <TextInput
        placeholder="Supplier Name"
        style={styles.input}
        value={supplier}
        onChangeText={setSupplier}
      />
      <TextInput
        placeholder="Order Date (YYYY-MM-DD)"
        style={styles.input}
        value={orderDate}
        onChangeText={setOrderDate}
      />

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <Button title="Upload Image" onPress={pickImage} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Generate Code" onPress={generateCodes} />
        </View>
      </View>

      {productCode !== '' && (
        <View style={styles.result}>
          <Text>Batch Code: {batchCode}</Text>
          <Text>Product Code: {productCode}</Text>
          <QRCode value={productCode} size={150} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginVertical: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#888',
    marginVertical: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  result: {
    marginTop: 20,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default InventoryScreen;
