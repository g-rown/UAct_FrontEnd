import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles'; 

const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

export default function ApplicationRecords() {
    const navigation = useNavigation();
    
    // State for application data, loading status, and error messages
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoading(true);
            try {
                // 1. Retrieve the token
                const token = await AsyncStorage.getItem('userToken');

                if (!token) {
                    setError("Unauthorized. Please log in.");
                    return;
                }

                // 2. Fetch the student's applications using the secured endpoint
                // The backend automatically filters this list to the logged-in student's applications.
                const response = await axios.get(
                    `${API_BASE_URL}/applications/`,
                    {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    }
                );
                
                setApplications(response.data); 
                
            } catch (err) {
                console.error("Error fetching applications:", err.response?.data || err.message);
                
                let errorMessage = "Failed to load application records.";
                if (err.response && err.response.status === 401) {
                    errorMessage = "Session expired. Please log in again.";
                } else if (err.response) {
                    errorMessage = `Server Error (${err.response.status}): ${JSON.stringify(err.response.data)}`;
                }
                
                setError(errorMessage);
                
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []); 

    // Helper function to render each application item
    const renderApplicationItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.header}>
                Program: {item.program.name} 
            </Text>
            <Text style={styles.detailText}>
                Submitted On: {new Date(item.submission_date).toLocaleDateString()}
            </Text>
            <Text style={styles.detailText}>
                Required Hours: {item.program.hours}
            </Text>
            <Text style={styles.detailText}>
                Status: **{item.status.toUpperCase()}**
            </Text>
        </View>
    );

    // --- RENDER LOGIC ---

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading Application Records...</Text>
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
            <Text style={styles.header}>Program Applications ({applications.length})</Text>
            
            <FlatList
                data={applications}
                keyExtractor={item => item.id.toString()}
                renderItem={renderApplicationItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No applications submitted yet.</Text>}
            />
        </View>
    );
}