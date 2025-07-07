import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const SaleScreen = () => {
  const [scannedCode, setScannedCode] = useState('');
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  const handleQRSuccess = async (e: any) => {
    const scanned = e.data;
    setScannedCode(scanned);

    try {
      const doc = await firestore().collection('inventory').doc(scanned).get();

      if (!doc.exists) {
        Alert.alert('Not Found', 'QR Code not found in inventory.');
        return;
      }

      setInventoryData(doc.data());
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data.');
    }
  };

  const handleSubmit = async () => {
    if (!customerName || !customerNumber || !sellingPrice) {
      Alert.alert('Missing Info', 'Please fill all fields.');
      return;
    }

    try {
      await firestore().collection('inventory').doc(scannedCode).update({
        customerName,
        customerNumber,
        sellingPrice,
        soldAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Data updated successfully!');
      // Optional: Reset
      setCustomerName('');
      setCustomerNumber('');
      setSellingPrice('');
      setInventoryData(null);
      setScannedCode('');
    } catch (error) {
      Alert.alert('Error', 'Could not update Firestore.');
    }
  };

  return (
    <View style={styles.container}>
      {!scannedCode ? (
        <>
          <Text style={styles.title}>Scan Product QR Code</Text>
          <QRCodeScanner
            onRead={handleQRSuccess}
            flashMode={RNCamera.Constants.FlashMode.auto}
            topContent={<Text>Align the QR code within the frame</Text>}
            bottomContent={<Text>Waiting for QR scan...</Text>}
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>Product Information</Text>
          {inventoryData && (
            <View style={styles.infoBox}>
              <Text>Batch Code: {inventoryData.batchCode}</Text>
              <Text>Order Date: {inventoryData.orderDate}</Text>
              <Text>Product Code: {inventoryData.productCode}</Text>
              <Text>Supplier: {inventoryData.supplier}</Text>
              <Text>Generated At: {new Date(inventoryData.timestamp).toLocaleString()}</Text>
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Customer Name"
            value={customerName}
            onChangeText={setCustomerName}
          />
          <TextInput
            style={styles.input}
            placeholder="Customer Phone Number"
            keyboardType="phone-pad"
            value={customerNumber}
            onChangeText={setCustomerNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Selling Price"
            keyboardType="numeric"
            value={sellingPrice}
            onChangeText={setSellingPrice}
          />

          <Button title="Submit Sale" onPress={handleSubmit} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  infoBox: {
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
});

export default SaleScreen;
