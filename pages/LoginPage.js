import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Alert, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import styles from '../styles';

export default function LoginPage() {
    const navigation = useNavigation();
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert("Error", "Please enter both username and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username,
                password,
            });
            
            const data = response.data;

            const token = data.token;
            const isAdmin = data.is_admin;
            const isStudent = data.is_student;

            await AsyncStorage.setItem('userToken', token); // 1. Save the token
            await AsyncStorage.setItem('isAdmin', String(isAdmin)); // 2. Save the Admin status
            await AsyncStorage.setItem('isStudent', String(isStudent)); // 3. Save the Student status

            if (data.is_admin) {
                Alert.alert('Login Successful', `Welcome Admin ${data.username}`);
                navigation.navigate('AdminDashboard');
            } else if (data.is_student) {
                Alert.alert('Login Successful', `Welcome Student ${data.username}`);
                navigation.navigate('StudentDashboard');
            } else {
                Alert.alert('Error', 'Unknown user role. Access denied.');
            }
            
        } catch (error) {
            console.error("Login attempt failed:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.non_field_errors?.[0] || 'Invalid username or password.';
            Alert.alert('Login Failed', errorMessage);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}
        >
            <Image 
                source={require('../assets/UA-Logo.png')}
                style = {styles.img} />
            <View style={styles.nobgcard}>
                <Text style={styles.header}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input} 
                    placeholder="Password"
                    secureTextEntry={true} 
                    value={password}
                    onChangeText={setPassword}
                />

                <Button style={styles.button}
                    title={loading ? 'Logging in...' : 'Login'} 
                    onPress={handleLogin}
                    disabled={loading}
                />
            </View>

            <Text style={styles.footerText}>
                Don't have an account?{' '}
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.linkText}>Register here</Text>
                </TouchableOpacity>
            </Text>
        </ImageBackground>
    );
}