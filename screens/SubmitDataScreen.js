import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput, Button, ImageBackground, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';

const SubmitDataScreen = () => {
    const navigation = useNavigation();
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [animation] = useState(new Animated.Value(0));
    const [cameraPermission, setCameraPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [imageUri, setImageUri] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(status === 'granted');
        })();
        animate();
        setLatitude('');
        setLongitude('');
        setImageUri(null);
    }, []);

    const animate = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };

    const takePicture = async () => {
        if (!cameraPermission) {
            Alert.alert('Permission Required', 'Please allow access to the camera to take pictures.');
            return;
        }
        try {
            const { uri } = await cameraRef.current.takePictureAsync();
            setImageUri(uri);
        } catch (error) {
            console.error('Error taking picture:', error);
            Alert.alert('Error', 'Failed to take picture. Please try again.');
        }
    };

    const handleSubmit = async () => {
        console.log('Submitting data:', { latitude, longitude, imageUri });

        if (!latitude || !longitude || !imageUri) {
            Alert.alert('Error', 'Please fill in all the fields and take a picture.');
            return;
        }

        try {
            const existingData = await AsyncStorage.getItem('userData');
            let newData = [];

            if (existingData) {
                newData = JSON.parse(existingData);
            }

            newData.push({ latitude, longitude, imageUrl: imageUri });
            await AsyncStorage.setItem('userData', JSON.stringify(newData));
            navigation.navigate('RetrieveData');
        } catch (error) {
            console.error('Error storing data:', error);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };

    return (
        <ImageBackground source={require('../assets/images/bg3.jpeg')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Submit Data</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Latitude"
                        value={latitude}
                        onChangeText={text => setLatitude(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Longitude"
                        value={longitude}
                        onChangeText={text => setLongitude(text)}
                    />
                </View>
                <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={takePicture}>
                            <Text style={styles.text}>Take Picture</Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
                {imageUri && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                    </View>
                )}
                <Button title="Submit" onPress={handleSubmit} />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        padding: 10,
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    camera: {
        width: 200,
        height: 200,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    imageContainer: {
        width: 200,
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default SubmitDataScreen;
