import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [animation] = useState(new Animated.Value(0));

    const handleSignup = async () => {

        try {
            const response = await fetch('https://test.webyaparsolutions.com/auth/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    name: name,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                Alert.alert('Success', data.message);
                navigation.navigate('Login');

            } else if (response.status === 400 && data.message === 'Values missing') {
                Alert.alert('Error', 'Please fill in all fields to SignUp successfully.');
            } else if (response.status === 400 && data.message === 'Username is already taken.') {
                Alert.alert('Error', 'Username is already taken.');
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again later.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };

    const animate = () => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };
    useEffect(() => {
        animate();
    }, []);

    const navigation = useNavigation();

    const handleLoginPress = () => {
        navigation.navigate('Login');
    };

    return (
        <ImageBackground source={require('../assets/images/bg3.jpeg')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Sign Up</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    value={email}
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#aaa"
                    value={name}
                    onChangeText={text => setName(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <TouchableOpacity style={styles.buttonContainer} onPress={handleSignup} onPressIn={animate}>
                    <Animated.Text style={[styles.buttonText, { opacity: animation }]}>Sign Up</Animated.Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.registerText}>
                        Already have an account?{' '}
                        <TouchableOpacity onPress={handleLoginPress}>
                            <Text style={styles.registerButton}>Login</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    input: {
        width: '80%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingLeft: 15,
        marginBottom: 20,
        fontSize: 16,
        color: '#333',
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
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    registerButton: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default SignupScreen;
