import React, { useState } from 'react';
import { Text, TextInput, ScrollView, Alert, TouchableOpacity, ImageBackground, Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import styles from '../styles'; 

export default function SignupPage() {
    const navigation = useNavigation();
  
    // --- State variables ---
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [course, setCourse] = useState("");
    const [yearLevel, setYearLevel] = useState("");
    const [section, setSection] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // --- Signup API ---
    const handleSignup = async () => {
        // Check for missing fields
        if (!firstName || !lastName || !course || !yearLevel || !phoneNumber || !section || !email || !username || !password || !confirmPassword) {
            Alert.alert("Missing Fields", "Please fill in all required fields.");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            Alert.alert("Validation Error", "Password and Confirm Password must match.");
            return;
        }

        setLoading(true);

        const userData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            username: username,
            password: password,
            course: course,
            year_level: yearLevel,
            section: section, 
            phone_number: phoneNumber,
        };

        try {
            const response = await axios.post('https://uact-backend.onrender.com/api/signup/', userData); 
            Alert.alert('Success', `Account created for ${response.data.username}. Please log in.`);
            navigation.navigate('Login'); 
        } catch (error) {
            let errorMessage = "An unknown error occurred during signup.";
            if (error.response?.data) {
                if (error.response.data.username) errorMessage = `Username: ${error.response.data.username[0]}`;
                else if (error.response.data.email) errorMessage = `Email: ${error.response.data.email[0]}`;
                else if (error.response.data.non_field_errors) errorMessage = error.response.data.non_field_errors[0];
            }
            Alert.alert('Signup Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                 <Image 
                source={require('../assets/logo.png')}
                style={styles.img}
                />
                <View style={styles.nobgcard}>
                    <Text style={styles.loginHeader}>Create an Account</Text>

                    <Text style={styles.subHeader}>Personal Details</Text>
                    <TextInput style={styles.input} placeholder="First Name" placeholderTextColor='gray' value={firstName} onChangeText={setFirstName} />
                    <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor='gray' value={lastName} onChangeText={setLastName} />
                    <TextInput style={styles.input} placeholder="Email" placeholderTextColor='gray' value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    <TextInput style={styles.input} placeholder="Phone Number" placeholderTextColor='gray' value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />

                    <Text style={styles.subHeader}>Academic Details</Text>
                    <TextInput style={styles.input} placeholder="Course" placeholderTextColor='gray' value={course} onChangeText={setCourse} autoCapitalize="characters" />
                    <TextInput style={styles.input} placeholder="Year Level" placeholderTextColor='gray' value={yearLevel} onChangeText={setYearLevel} keyboardType="numeric" />
                    <TextInput style={styles.input} placeholder="Section" placeholderTextColor='gray' value={section} onChangeText={setSection} autoCapitalize="characters" />
                    
                    <Text style={styles.subHeader}>Account Credentials</Text>
                    <TextInput style={styles.input} placeholder="Username" placeholderTextColor='gray' value={username} onChangeText={setUsername} autoCapitalize="none" />
                    <TextInput style={styles.input} placeholder="Password" placeholderTextColor='gray' secureTextEntry={true} value={password} onChangeText={setPassword} />
                    <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor='gray' secureTextEntry={true} value={confirmPassword} onChangeText={setConfirmPassword} 
                    />

                    <View>
                        <TouchableOpacity
                            style={styles.signupButton} 
                            onPress={handleSignup}
                            disabled={loading}
                        >
                            <Text style={styles.signupButtonText}>
                                {loading ? 'Registering...' : 'Sign Up'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                    <Text style={styles.footerText}>
                        Already have an account?{' '}
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.linkText}>Login here</Text>
                        </TouchableOpacity>
                    </Text>

                
            </ScrollView>
        </ImageBackground>
    );
}
