<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Needed for token

import styles from '../styles'; // Ensure this path is correct

// Replace with your actual base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api'; 
=======
// pages/CommunityPrograms.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
// 🔑 NEW: Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'; 
>>>>>>> f2711ac4fc56afde9a5453e5f7676afe967a3d92

export default function CommunityPrograms() {
    const navigation = useNavigation();

<<<<<<< HEAD
    // State for program data, loading status, and error messages
    const [programs, setPrograms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
=======
    const API_URL = "http://127.0.0.1:8000/api/programs/";
>>>>>>> f2711ac4fc56afde9a5453e5f7676afe967a3d92

    // 🚀 MODIFIED: Changed useEffect to an async function to retrieve the token
    useEffect(() => {
        const fetchPrograms = async () => {
<<<<<<< HEAD
            setIsLoading(true);
            try {
                // 1. Retrieve the token from storage
                const token = await AsyncStorage.getItem('userToken');

                if (!token) {
                    setError("You must be logged in to view programs.");
                    setIsLoading(false);
                    return;
                }
=======
            let token = null;
            try {
                // 1. Retrieve the token from storage
                token = await AsyncStorage.getItem('userToken');

                if (!token) {
                    console.error("Token not found. Cannot fetch programs.");
                    // Optionally navigate user back to login or show an alert
                    // navigation.navigate('LoginPage'); 
                    setLoading(false);
                    return;
                }
                
                // 2. Make the authenticated fetch request
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 🔑 CRITICAL: Include the Authorization header
                        'Authorization': `Token ${token}`
                    },
                });

                // 3. Handle non-200 responses (like 401 or 403)
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Failed to fetch programs with authentication.');
                }

                const data = await response.json();
                
                // 4. Update state with program data
                setPrograms(data);

            } catch (error) {
                console.error("Fetch Error:", error.message);
            } finally {
                // 5. Always set loading to false
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []); // Empty dependency array ensures it runs only once on mount

    // Your renderProgram and return blocks remain the same
    const renderProgram = ({ item }) => (
        // ... (rest of your renderProgram code)
        <View style={{
            backgroundColor: "#fff",
            padding: 15,
            marginVertical: 10,
            borderRadius: 10,
            elevation: 3
        }}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Facilitator: {item.facilitator}</Text>
            <Text style={{ marginTop: 5 }}>Location: {item.location}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Hours: {item.hours}</Text>
            <Text>Slots Remaining: {item.slots_remaining}</Text>
>>>>>>> f2711ac4fc56afde9a5453e5f7676afe967a3d92

                // 2. Fetch data using the token
                const response = await axios.get(
                    `${API_BASE_URL}/programs/`,
                    {
                        headers: {
                            'Authorization': `Token ${token}` // Authenticate the request
                        }
                    }
                );
                
                // Assuming the response data is an array of program objects
                setPrograms(response.data); 
                
            } catch (err) {
                console.error("Error fetching programs:", err.response?.data || err.message);
                
                let errorMessage = "Failed to load programs.";
                if (err.response && err.response.status === 401) {
                    errorMessage = "Unauthorized. Please log in again.";
                } else if (err.response) {
                    errorMessage = `Server Error (${err.response.status}): ${JSON.stringify(err.response.data)}`;
                }
                
                setError(errorMessage);
                
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, []); // Runs once on component mount

    // Helper function to render each program item
    const renderProgramItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.detailText}>Organization: {item.organization}</Text>
            <Text style={styles.detailText}>Required Hours: {item.hours}</Text>
            <Text style={styles.detailText}>
                Slots: {item.slots_taken} / {item.slots}
            </Text>
            <Button 
                title="Apply Now"
                onPress={() => navigation.navigate('ProgramApplication', { programId: item.id, programName: item.name })}
                disabled={item.slots_taken >= item.slots}
            />
        </View>
    );

    // --- RENDER LOGIC ---

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading Community Programs...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>❌ Error: {error}</Text>
                <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Available Community Programs ({programs.length})</Text>
 <FlatList
                data={programs}
                keyExtractor={item => item.id.toString()}
                renderItem={renderProgramItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No active programs found.</Text>}
            />
        </View>
    );
}