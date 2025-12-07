import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from '../styles';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
                `${API_BASE_URL}/programs/${program.id}/`,
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
            navigation.navigate('ManagePrograms', { updatedProgram: response.data });

        } catch (err) {
            console.error(err.response?.data || err.message);
            Alert.alert('Error', 'Failed to update program. Check console for details.');
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <View style={[styles.container, { flex: 1, paddingTop: 40, alignItems: 'center' }]}>
            <View style={{
                width: '50%',
                flex: 1,
                backgroundColor: '#fff',
                borderWidth: 1,
                borderColor: '#e0e0e0',
                borderRadius: 12,
                overflow: 'hidden'
            }}>

                {/* HEADER */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: '#f0f0f0',
                    elevation: 4,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e6e6e6'
                }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Edit Program</Text>
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingVertical: 20 }}>

                    <Text>Name *</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} />

                    <Text>Description *</Text>
                    <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} multiline />

                    <Text>Location</Text>
                    <TextInput style={styles.input} value={location} onChangeText={setLocation} />

                    <Text>Facilitator</Text>
                    <TextInput style={styles.input} value={facilitator} onChangeText={setFacilitator} />

                    <Text>Date (YYYY-MM-DD) *</Text>
                    <TextInput style={styles.input} value={date} onChangeText={setDate} />

                    <Text>Time Start (HH:MM) *</Text>
                    <TextInput style={styles.input} value={timeStart} onChangeText={setTimeStart} />

                    <Text>Time End (HH:MM) *</Text>
                    <TextInput style={styles.input} value={timeEnd} onChangeText={setTimeEnd} />

                    <Text>Hours *</Text>
                    <TextInput style={styles.input} value={hours} onChangeText={setHours} keyboardType="numeric" />

                    <Text>Slots *</Text>
                    <TextInput style={styles.input} value={slots} onChangeText={setSlots} keyboardType="numeric" />

                    <TouchableOpacity
                        onPress={handleUpdateProgram}
                        style={{ backgroundColor: '#007bff', padding: 15, borderRadius: 12, marginTop: 20, elevation: 3 }}
                    >
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}