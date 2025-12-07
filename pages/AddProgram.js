import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from '../styles';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

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
            navigation.navigate('ManagePrograms', { refresh: true, newProgram: response.data });

        } catch (err) {
            console.error(err.response?.data || err.message);
            Alert.alert('Error', 'Failed to add program. Check console for details.');
        }
    };

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
                    zIndex: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e6e6e6'
                }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Add Program</Text>
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
                    <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2025-12-07" />

                    <Text>Time Start (HH:MM) *</Text>
                    <TextInput style={styles.input} value={timeStart} onChangeText={setTimeStart} placeholder="08:00" />

                    <Text>Time End (HH:MM) *</Text>
                    <TextInput style={styles.input} value={timeEnd} onChangeText={setTimeEnd} placeholder="12:00" />

                    <Text>Hours *</Text>
                    <TextInput style={styles.input} value={hours} onChangeText={setHours} keyboardType="numeric" />

                    <Text>Slots *</Text>
                    <TextInput style={styles.input} value={slots} onChangeText={setSlots} keyboardType="numeric" />

                    <TouchableOpacity
                        onPress={handleAddProgram}
                        style={{ backgroundColor: '#007bff', padding: 15, borderRadius: 12, marginTop: 20, elevation: 3 }}
                    >
                        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Add Program</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}