import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RetrieveDataScreen = ({ navigation }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('userData');
            if (storedData) {
                setData(JSON.parse(storedData));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addNewData = () => {
        navigation.navigate('FormSubmit');
    };

    const deleteItem = async (index) => {
        try {
            console.log("deleting it");

            const newData = [...data];
            newData.splice(index, 1);
            await AsyncStorage.setItem('userData', JSON.stringify(newData));
            setData(newData);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleLogout = () => {
        console.log("Loggin out!");

        navigation.navigate('Login');
    };

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Retrieved Data</Text>
                <FlatList
                    data={data.reverse()}
                    renderItem={({ item, index }) => (
                        <View style={styles.dataItem}>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(index)}>
                                <Text style={styles.deleteButtonText}>X</Text>
                            </TouchableOpacity>
                            <Text style={styles.text}>Latitude: {item.latitude}</Text>
                            <Text style={styles.text}>Longitude: {item.longitude}</Text>
                            <Image source={{ uri: item.imageUrl }} style={styles.image} />
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContainer}
                />
                <TouchableOpacity style={styles.addButton} onPress={addNewData}>
                    <Text style={styles.addButtonText}>Add New Data</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
        marginTop: 30
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    listContainer: {
        flexGrow: 1,
    },
    dataItem: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#fff',
        position: 'relative',
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'red',
        width: 38,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    logoutButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default RetrieveDataScreen;
