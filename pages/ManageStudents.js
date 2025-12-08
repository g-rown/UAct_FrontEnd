import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles'; 

// 🚨 REMINDER: Change this IP to 10.0.2.2 (Android Emulator) 
// or your local IP (Physical Device) if you haven't already.
const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

export default function ManageStudents() {
    const navigation = useNavigation();
    
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authToken, setAuthToken] = useState(null); 

    // --- Data Fetching Logic (Refactored to be reusable) ---
    const fetchStudents = async (token) => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/students/`,
                {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                }
            );
            setStudents(response.data); 
            setError(null); // Clear previous errors if successful
        } catch (err) {
            console.error("Error fetching students:", err.response?.data || err.message);
            
            let errorMessage = "Failed to load students.";
            if (err.response && err.response.status === 403) {
                errorMessage = "Access Denied: You must be an Admin to view this list.";
            } else if (err.response) {
                errorMessage = `Server Error (${err.response.status}): ${JSON.stringify(err.response.data)}`;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Load token and fetch students on component mount and when screen is focused
    useFocusEffect(
        useCallback(() => {
            const loadTokenAndFetch = async () => {
                const token = await AsyncStorage.getItem('userToken');
                const isAdminString = await AsyncStorage.getItem('isAdmin');
                const isAdmin = isAdminString === 'true'; 

                if (!token || !isAdmin) {
                    setError("Access Denied: You must be logged in as an Admin.");
                    setIsLoading(false);
                    return;
                }
                
                setAuthToken(token); 
                fetchStudents(token);
            };

            loadTokenAndFetch();
        }, [])
    );

    // --- Admin Actions ---
    
    // 🗑️ DELETE functions removed.
    
    const handleEditStudent = (studentData) => {
        // Navigate to the EditStudent screen
        navigation.navigate('EditStudent', { student: studentData });
    };

    // --- Render Item ---
    const renderStudentItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.nameText}>
                {item.user.first_name} {item.user.last_name}
            </Text>
            <Text style={styles.detailText}>
                Email: {item.user.email}
            </Text>
            <Text style={styles.detailText}>
                Course/Year/Section: {item.course}/{item.year_level}/{item.section}
            </Text>
            <Text style={styles.detailText}>
                Hours Completed: **{item.hours_completed} / {item.total_required_hours}**
            </Text>

            {/* Admin Action Buttons */}
            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditStudent(item)}
                >
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                {/* 🗑️ DELETE button removed */}
            </View>
        </View>
    );

    // --- RENDER LOGIC ---

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading Student Data...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>❌ Error: {error}</Text>
                <Text style={styles.hintText}>
                    Ensure your Django server is running and you have a valid Admin token.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>MANAGE STUDENTS ({students.length})</Text>
            
            <FlatList
                data={students}
                keyExtractor={item => item.id.toString()}
                renderItem={renderStudentItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No students found.</Text>}
            />
        </View>
    );
}