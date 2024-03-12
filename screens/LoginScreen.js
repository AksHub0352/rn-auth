import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [animation] = useState(new Animated.Value(0));

    const handleLogin = async () => {
        try {
            const response = await fetch('https://test.webyaparsolutions.com/auth/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            console.log('Response:', response);

            const data = await response.json();

            console.log('Data:', data);

            if (response.status === 200 && data.success) {
                Alert.alert('Success', data.message);
                navigation.navigate('FormSubmit');
            } else if (response.status === 400) {
                if (data.message === 'Values missing') {
                    Alert.alert('Error', 'Please fill in both email and password fields.');
                } else if (data.message === 'Email or password incorrect.') {
                    Alert.alert('Error', 'Email or password incorrect.');
                } else {
                    throw new Error('Something went wrong. Please try again later.');
                }
            } else if (response.status === 403) {
                if (data.message === 'Password does not match.') {
                    Alert.alert('Error', 'Password does not match.');
                } else {
                    throw new Error('Something went wrong. Please try again later.');
                }
            } else {

                throw new Error('Something went wrong. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', error.message);
        }
    };




    const animate = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        animate();
    }, []);

    const handleRegisterPress = () => {
        navigation.navigate('Signup');
    };

    return (
        <ImageBackground source={require('../assets/images/bg3.jpeg')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Welcome Back!</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#fff"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#fff"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin} onPressIn={animate}>
                    <Animated.Text style={[styles.buttonText, { opacity: animation }]}>Login</Animated.Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.registerText}>
                        Don't have an account?{' '}
                        <TouchableOpacity onPress={handleRegisterPress}>
                            <Text style={styles.registerButton}>Register</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
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
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#fff',
    },
    input: {
        width: '80%',
        height: 50,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 10,
        paddingLeft: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#fff',
    },
    buttonContainer: {
        backgroundColor: '#007bff',
        width: '80%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    registerText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    registerButton: {
        color: 'white',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
