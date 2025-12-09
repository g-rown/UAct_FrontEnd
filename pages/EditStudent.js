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

// --- START OF STYLES MODIFICATION ---
// COLOR PALETTE (UA LOGO)
const COLOR_BLUE = '#001e66';
const COLOR_RED = '#cf1a24';
const COLOR_YELLOW = '#ffd800';
const COLOR_LIGHT_GRAY = '#f4f4f4';
const COLOR_MEDIUM_GRAY = '#e0e0e0';
const COLOR_DARK_GRAY = '#333333';

const API_BASE_URL = 'https://uact-backend.onrender.com/api/students'; 

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
                navigation.navigate('AdminDashboard', { // 1. Navigate to the name of the STACK SCREEN that holds the tabs
                    screen: 'ManageStudents', // 2. Specify the screen NAME inside that Tab Navigator
                    params: {
                        refresh: true 
                    },
                });
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
        <ScrollView contentContainerStyle={componentStyles.scrollContainer}>
            <View style={componentStyles.mainWrapper}>
                <View style={componentStyles.formCard}>
                    
                    {/* HEADER */}
                    <View style={componentStyles.header}>
                        <Text style={componentStyles.headerTitle}>Edit Student Profile</Text>
                    </View>

                    <View style={componentStyles.formBody}>
                    
                        {/* Read-Only User Info Section */}
                        <View style={componentStyles.infoSection}>
                            <Text style={componentStyles.infoTitle}>User Details (Read Only)</Text>
                            <View style={componentStyles.infoItem}>
                                <Text style={componentStyles.infoLabel}>Name:</Text>
                                <Text style={componentStyles.infoValue}>
                                    {student.user.first_name} {student.user.last_name}
                                </Text>
                            </View>
                            <View style={componentStyles.infoItem}>
                                <Text style={componentStyles.infoLabel}>Username:</Text>
                                <Text style={componentStyles.infoValue}>{student.user.username}</Text>
                            </View>
                        </View>
                        
                        <View style={componentStyles.sectionTitleContainer}>
                            <Text style={componentStyles.sectionTitle}>Student Academic Details</Text>
                        </View>

                        <View style={componentStyles.inputGroup}>
                            <Text style={componentStyles.label}>Course</Text>
                            <TextInput
                                style={componentStyles.input}
                                value={course}
                                onChangeText={setCourse}
                                placeholder="e.g., BSIT"
                                placeholderTextColor="#999"
                            />
                        </View>
                        
                        <View style={componentStyles.rowGroup}>
                            <View style={componentStyles.inputThird}>
                                <Text style={componentStyles.label}>Year Level</Text>
                                <TextInput
                                    style={componentStyles.input}
                                    value={yearLevel}
                                    onChangeText={setYearLevel}
                                    placeholder="e.g., 3"
                                    keyboardType="numeric"
                                    placeholderTextColor="#999"
                                />
                            </View>
                            <View style={componentStyles.inputThird}>
                                <Text style={componentStyles.label}>Section</Text>
                                <TextInput
                                    style={componentStyles.input}
                                    value={section}
                                    onChangeText={setSection}
                                    placeholder="e.g., A"
                                    placeholderTextColor="#999"
                                />
                            </View>
                            <View style={componentStyles.inputThird}>
                                <Text style={componentStyles.label}>Phone Number</Text>
                                <TextInput
                                    style={componentStyles.input}
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    placeholder="09xxxxxxxxx"
                                    keyboardType="phone-pad"
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>
                        
                        <TouchableOpacity 
                            style={componentStyles.saveButton} 
                            onPress={handleUpdateStudent}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={componentStyles.saveButtonText}>SAVE CHANGES</Text>
                            )}
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={componentStyles.cancelButton}
                        >
                            <Text style={componentStyles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const componentStyles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: COLOR_LIGHT_GRAY, // Light gray background
        paddingVertical: 40,
        alignItems: 'center',
    },
    mainWrapper: {
        width: '90%',
        maxWidth: 900, 
        flex: 1,
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLOR_BLUE, // Branded Blue Header
        borderBottomWidth: 1,
        borderBottomColor: COLOR_YELLOW, // Yellow Accent
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    formBody: {
        padding: 20,
    },
    // Read-Only Info Styles
    infoSection: {
        backgroundColor: COLOR_LIGHT_GRAY,
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLOR_MEDIUM_GRAY,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR_DARK_GRAY,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLOR_MEDIUM_GRAY,
        paddingBottom: 5,
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    infoLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: COLOR_BLUE,
        width: 90, // Fixed width for alignment
    },
    infoValue: {
        fontSize: 15,
        color: COLOR_DARK_GRAY,
        fontWeight: 'bold',
        flexShrink: 1, // Allows text to wrap
    },
    // Editable Field Styles
    sectionTitleContainer: {
        borderBottomWidth: 2,
        borderBottomColor: COLOR_YELLOW,
        paddingBottom: 5,
        marginBottom: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR_BLUE,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLOR_DARK_GRAY,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: COLOR_MEDIUM_GRAY,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: COLOR_DARK_GRAY,
        backgroundColor: '#fff',
    },
    rowGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    inputThird: {
        width: '30%', // Adjusted for a 3-column layout
    },
    // Button Styles
    saveButton: {
        backgroundColor: COLOR_BLUE, 
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        elevation: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff', 
        fontWeight: 'bold',
        fontSize: 16
    },
    cancelButton: {
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        borderColor: COLOR_MEDIUM_GRAY,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: COLOR_DARK_GRAY, 
        fontWeight: 'bold',
        fontSize: 16
    },
});