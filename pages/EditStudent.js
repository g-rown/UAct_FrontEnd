import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    ActivityIndicator,
    ScrollView 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 🚫 Removed: import { API_URL } from '../config'; 

// ⭐️ Hardcoded API URL - CHANGE THIS to your emulator/device IP!
// Use 'http://10.0.2.2:8000' for Android Emulator
// Use 'http://192.168.x.x:8000' for physical device/WIFI
const API_BASE_URL = 'http://127.0.0.1:8000/api/students'; 

// Assuming you have an Admin Home screen you want to navigate back to
const ADMIN_HOME_SCREEN = 'AdminHome'; 

export default function EditStudent({ route, navigation }) {
    const { student } = route.params; 

    const [course, setCourse] = useState('');
    const [yearLevel, setYearLevel] = useState('');
    const [section, setSection] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialize state with current student data
    useEffect(() => {
        setCourse(student.course || '');
        setYearLevel(student.year_level || '');
        setSection(student.section || '');
        setPhoneNumber(student.phone_number || '');
    }, [student]);

    // --- API Submission Function ---
    const handleUpdateStudent = async () => {
        setLoading(true);
        
        // 1. Get the Auth Token
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
             Alert.alert('Error', 'Authentication token missing.');
             setLoading(false);
             return;
        }

        // 2. Prepare the data payload
        const updatedData = {
            course: course,
            year_level: yearLevel,
            section: section,
            phone_number: phoneNumber,
            // Only sending editable fields defined in the serializer
        };

        try {
            // 3. Construct the full URL: BASE_URL/id/
            const url = `${API_BASE_URL}/${student.id}/`;
            
            const response = await axios.put(url, updatedData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // 4. Handle success
            if (response.status === 200) {
                Alert.alert("Success", `${student.user.first_name}'s profile updated successfully.`);
                
                // Navigate back and trigger a refresh on the ManageStudents screen
                navigation.navigate('ManageStudents', { refresh: true });
            } 

        } catch (error) {
            console.error('Update Error:', error.response ? error.response.data : error.message);
            Alert.alert(
                "Update Failed", 
                `An error occurred: ${error.response?.data?.detail || error.message}`
            );
        } finally {
            setLoading(false);
        }
    };

    // --- Component UI ---
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.header}>Edit Student Profile</Text>
                
                {/* Display Read-Only User Info */}
                <Text style={styles.readOnlyText}>
                    Name: **{student.user.first_name} {student.user.last_name}**
                </Text>
                <Text style={styles.readOnlyText}>
                    Username: **{student.user.username}**
                </Text>
                
                <View style={styles.divider} />

                <Text style={styles.label}>Course</Text>
                <TextInput
                    style={styles.input}
                    value={course}
                    onChangeText={setCourse}
                    placeholder="e.g., BSIT"
                />

                <Text style={styles.label}>Year Level</Text>
                <TextInput
                    style={styles.input}
                    value={yearLevel}
                    onChangeText={setYearLevel}
                    placeholder="e.g., 3"
                    keyboardType="numeric"
                />
                
                <Text style={styles.label}>Section</Text>
                <TextInput
                    style={styles.input}
                    value={section}
                    onChangeText={setSection}
                    placeholder="e.g., A"
                />
                
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="e.g., 09123456789"
                    keyboardType="phone-pad"
                />
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleUpdateStudent}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Save Changes</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    readOnlyText: {
        fontSize: 16,
        marginBottom: 5,
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});