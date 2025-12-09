import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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

const API_BASE_URL = 'https://uact-backend.onrender.com/api/programs';

export default function EditProgram() {
    const navigation = useNavigation();
    const route = useRoute();
    const program = route.params?.program;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [facilitator, setFacilitator] = useState('');
    const [date, setDate] = useState('');
    const [timeStart, setTimeStart] = useState('');
    const [timeEnd, setTimeEnd] = useState('');
    const [hours, setHours] = useState('');
    const [slots, setSlots] = useState('');

    const [loading, setLoading] = useState(true);

    // Load selected program details
    useEffect(() => {
        if (!program) {
            Alert.alert("Error", "No program data received.");
            navigation.goBack();
            return;
        }

        setName(program.name);
        setDescription(program.description);
        setLocation(program.location);
        setFacilitator(program.facilitator);
        setDate(program.date);
        setTimeStart(program.time_start);
        setTimeEnd(program.time_end);
        setHours(String(program.hours));
        setSlots(String(program.slots));

        setLoading(false);
    }, [program]);

    const handleUpdateProgram = async () => {
        if (!name || !description || !hours || !slots || !date || !timeStart || !timeEnd) {
            Alert.alert('Error', 'Please fill all required fields.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert('Error', 'You must be logged in to update a program.');
                return;
            }

            const parsedHours = parseInt(hours);
            const parsedSlots = parseInt(slots);

            const response = await axios.put(
                `${API_BASE_URL}/${program.id}/`,
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

            Alert.alert('Success', 'Program updated successfully!');
            navigation.navigate('AdminDashboard', {
    screen: 'ManagePrograms', // Name of the screen inside AdminTabs
    params: { 
        updatedProgram: response.data 
    },
});

        } catch (err) {
            console.error(err.response?.data || err.message);
            Alert.alert('Error', 'Failed to update program. Check console for details.');
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLOR_BLUE} />
            </View>
        );
    }

    return (
        <View style={[styles.container, componentStyles.fullPage]}>
            <View style={componentStyles.formCard}>

                {/* HEADER */}
                <View style={componentStyles.header}>
                    <Text style={componentStyles.headerTitle}>Edit Program</Text>
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={componentStyles.scrollViewContent}>

                    <View style={componentStyles.inputGroup}>
                        <Text style={componentStyles.label}>Program Name <Text style={componentStyles.required}>*</Text></Text>
                        <TextInput 
                            style={componentStyles.input} 
                            value={name} 
                            onChangeText={setName} 
                            placeholder="e.g., Leadership Workshop"
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
                            placeholder="A brief summary of the program's objectives."
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={componentStyles.inputGroup}>
                        <Text style={componentStyles.label}>Location</Text>
                        <TextInput 
                            style={componentStyles.input} 
                            value={location} 
                            onChangeText={setLocation} 
                            placeholder="e.g., Auditorium B or Online"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={componentStyles.inputGroup}>
                        <Text style={componentStyles.label}>Facilitator</Text>
                        <TextInput 
                            style={componentStyles.input} 
                            value={facilitator} 
                            onChangeText={setFacilitator} 
                            placeholder="e.g., Prof. Juan Dela Cruz"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Date and Time Section */}
                    <View style={componentStyles.sectionTitleContainer}>
                        <Text style={componentStyles.sectionTitle}>Scheduling</Text>
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
                                placeholder="HH:MM (e.g., 09:00)"
                                placeholderTextColor="#999"
                            />
                        </View>
                        <View style={componentStyles.inputHalf}>
                            <Text style={componentStyles.label}>Time End <Text style={componentStyles.required}>*</Text></Text>
                            <TextInput 
                                style={componentStyles.input} 
                                value={timeEnd} 
                                onChangeText={setTimeEnd} 
                                placeholder="HH:MM (e.g., 17:00)"
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
                            placeholder="Max number of participants"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleUpdateProgram}
                        style={componentStyles.saveButton}
                    >
                        <Text style={componentStyles.saveButtonText}>SAVE CHANGES</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={componentStyles.cancelButton}
                    >
                        <Text style={componentStyles.cancelButtonText}>Cancel</Text>
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
        backgroundColor: COLOR_LIGHT_GRAY // Light gray background for contrast
    },
    formCard: {
        width: '95%',
        maxWidth: 700, // Adjusted max width for good form layout
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
        backgroundColor: COLOR_BLUE, // Branded Blue Header
        borderBottomWidth: 1,
        borderBottomColor: COLOR_YELLOW, // Yellow Accent
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    scrollViewContent: { 
        paddingVertical: 20,
        paddingBottom: 50 // Extra padding for button space
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
    saveButton: {
        backgroundColor: COLOR_BLUE, // Primary action color (Blue)
        padding: 15,
        borderRadius: 8,
        marginTop: 30,
        elevation: 5,
    },
    saveButtonText: {
        color: '#fff', 
        textAlign: 'center', 
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
    },
    cancelButtonText: {
        color: COLOR_DARK_GRAY, 
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: 16
    },
});