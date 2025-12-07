import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles';

export default function LoginPage() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', {
            username,
            password,
        });
        
        const data = response.data;
        
        // 🔑 CRITICAL: Extract and Save the Token
        const token = data.token;
        if (token) {
             await AsyncStorage.setItem('userToken', token);
        }

        // 🔑 CRITICAL: Use the saved data
        if (data.is_admin) {
            navigation.navigate('AdminDashboard');
        } else if (data.is_student) {
            navigation.navigate('StudentDashboard');
        } else {
            Alert.alert('Error', 'Unknown user role');
        }
    } catch (error) {
        // Log the error for debugging. If the server response contains a detail field, show it.
        const errorMessage = error.response?.data?.detail || 'Invalid username or password';
        Alert.alert('Login Failed', errorMessage);
    }
};

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.header}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />

                <View style={styles.passwordContainer}> 
                    <TextInput
                        style={styles.passwordInput} 
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Feather 
                            name={showPassword ? 'eye' : 'eye-off'} // Changes icon based on state
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>

                <Button title="Login" onPress={handleLogin} />
            </View>
        </View>
    );
}
