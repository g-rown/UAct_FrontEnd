import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from '../styles';

// --- START OF STYLES MODIFICATION ---
// COLOR PALETTE (UA LOGO)
const COLOR_BLUE = '#001e66';
const COLOR_RED = '#cf1a24';
const COLOR_YELLOW = '#ffd800';
const COLOR_LIGHT_GRAY = '#f4f4f4';
const COLOR_MEDIUM_GRAY = '#e0e0e0';
const COLOR_DARK_GRAY = '#333333';

const API_BASE_URL = 'https://uact-backend.onrender.com/api';

export default function AddProgram() {
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [facilitator, setFacilitator] = useState('');
    const [date, setDate] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [hours, setHours] = useState('');
    const [slots, setSlots] = useState('');

    const handleAddProgram = async () => {
        if (!name || !description || !hours || !slots || !date || !timeStart || !timeEnd) {
            Alert.alert('Error', 'Please fill all required fields.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Error', 'You must be logged in to add a program.');
                return;
            }

            const parsedHours = parseInt(hours);
            const parsedSlots = parseInt(slots);

            const response = await axios.post(
                `${API_BASE_URL}/programs/`,
                {
                    name,
                    description,
                    location,
                    facilitator,
                    date,
                    time_start: timeStart,
                    time_end: timeEnd,
                    hours: parsedHours,
                    slots: parsedSlots,
                },
                {
                    headers: { Authorization: `Token ${token}` }
                }
            );

            Alert.alert('Success', 'Program added successfully!');
            
            // FIX APPLIED HERE
            navigation.navigate('AdminDashboard', { 
                screen: 'ManagePrograms', 
                params: { 
                    newProgram: response.data 
                } 
            });

        } catch (err) {
            console.error(err.response?.data || err.message);
            Alert.alert('Error', 'Failed to add program. Check console for details.');
        }
    };

    return (
        <View style={[styles.container, componentStyles.fullPage]}>
            <View style={componentStyles.formCard}>
                {/* HEADER */}
                <View style={componentStyles.header}>
                    <Text style={componentStyles.headerTitle}>Add New Program</Text>
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={componentStyles.scrollViewContent}>

                    <View style={componentStyles.inputGroup}>
                        <Text style={componentStyles.label}>Program Name <Text style={componentStyles.required}>*</Text></Text>
                        <TextInput 
                            style={componentStyles.input} 
                            value={name} 
                            onChangeText={setName} 
                            placeholder="e.g., Team Building Retreat"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={componentStyles.inputGroup}>
                        <Text style={componentStyles.label}>Description <Text style={componentStyles.required}>*</Text></Text>
                        <TextInput 
                            style={[componentStyles.input, componentStyles.textArea]} 
                            value={description} 
                            onChangeText={setDescription} 
                            multiline 
                            placeholder="A brief summary of the program's content."
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={componentStyles.inputGroup}>
                        <Text style={componentStyles.label}>Location</Text>
                        <TextInput 
                            style={componentStyles.input} 
                            value={location} 
                            onChangeText={setLocation} 
                            placeholder="e.g., Function Hall or Google Meet"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={componentStyles.inputGroup}>
                        <Text style={componentStyles.label}>Facilitator</Text>
                        <TextInput 
                            style={componentStyles.input} 
                            value={facilitator} 
                            onChangeText={setFacilitator} 
                            placeholder="e.g., Dr. Maria Santos"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Date and Time Section */}
                    <View style={componentStyles.sectionTitleContainer}>
                        <Text style={componentStyles.sectionTitle}>Scheduling Details</Text>
                    </View>

                    <View style={componentStyles.rowGroup}>
                        <View style={componentStyles.inputHalf}>
                            <Text style={componentStyles.label}>Date <Text style={componentStyles.required}>*</Text></Text>
                            <TextInput
                                style={componentStyles.input}
                                value={date}
                                onChangeText={setDate}
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#999"
                            />
                        </View>
                        <View style={componentStyles.inputHalf}>
                            <Text style={componentStyles.label}>Hours <Text style={componentStyles.required}>*</Text></Text>
                            <TextInput 
                                style={componentStyles.input} 
                                value={hours} 
                                onChangeText={setHours} 
                                keyboardType="numeric" 
                                placeholder="Total hours"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <View style={componentStyles.rowGroup}>
                        <View style={componentStyles.inputHalf}>
                            <Text style={componentStyles.label}>Time Start <Text style={componentStyles.required}>*</Text></Text>
                            <TextInput
                                style={componentStyles.input}
                                value={timeStart}
                                onChangeText={setTimeStart}
                                placeholder="HH:MM (e.g., 08:30)"
                                placeholderTextColor="#999"
                            />
                        </View>
                        <View style={componentStyles.inputHalf}>
                            <Text style={componentStyles.label}>Time End <Text style={componentStyles.required}>*</Text></Text>
                            <TextInput
                                style={componentStyles.input}
                                value={timeEnd}
                                onChangeText={setTimeEnd}
                                placeholder="HH:MM (e.g., 16:30)"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    {/* Slots Section */}
                    <View style={componentStyles.sectionTitleContainer}>
                        <Text style={componentStyles.sectionTitle}>Capacity</Text>
                    </View>

                    <View style={componentStyles.inputGroup}>
                        <Text style={componentStyles.label}>Slots Available <Text style={componentStyles.required}>*</Text></Text>
                        <TextInput 
                            style={componentStyles.input} 
                            value={slots} 
                            onChangeText={setSlots} 
                            keyboardType="numeric" 
                            placeholder="Maximum number of participants"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleAddProgram}
                        style={componentStyles.submitButton}
                    >
                        <Text style={componentStyles.submitButtonText}>CREATE PROGRAM</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}

const componentStyles = StyleSheet.create({
    fullPage: {
        flex: 1, 
        paddingTop: 40, 
        alignItems: 'center',
        backgroundColor: COLOR_LIGHT_GRAY
    },
    formCard: {
        width: '90%',
        maxWidth: 700, 
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLOR_BLUE,
        borderBottomWidth: 1,
        borderBottomColor: COLOR_YELLOW,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollViewContent: { 
        paddingVertical: 20,
        paddingBottom: 50
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
    required: {
        color: COLOR_RED,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: 1,
        borderColor: COLOR_MEDIUM_GRAY,
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
        color: COLOR_DARK_GRAY,
        backgroundColor: COLOR_LIGHT_GRAY,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    rowGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    inputHalf: {
        width: '48%',
    },
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
    submitButton: {
        backgroundColor: COLOR_BLUE, // Primary action color
        padding: 15,
        borderRadius: 8,
        marginTop: 30,
        elevation: 5,
    },
    submitButtonText: {
        color: '#fff', 
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: 16
    },
});