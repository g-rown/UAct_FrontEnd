import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles'; 

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

    const handleDeleteStudent = (studentId) => {
    Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this student and all associated records? This action cannot be undone.",
        [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    setIsLoading(true);
                    
                    // CRITICAL: Re-fetch the token right before the action to ensure it's fresh
                    const token = await AsyncStorage.getItem('userToken');

                    if (!token) {
                        Alert.alert("Error", "Authentication token is missing.");
                        setIsLoading(false);
                        return;
                    }
                    
                    try {
                        console.log("Attempting DELETE on:", `${API_BASE_URL}/students/${studentId}/`); 
                        console.log("Token: ", token.substring(0, 10) + '...'); // Log partial token

                        await axios.delete(
                            `${API_BASE_URL}/students/${studentId}/`,
                            {
                                headers: {
                                    'Authorization': `Token ${token}` // Use the freshly fetched token
                                }
                            }
                        );
                        
                        Alert.alert("Success", "Student profile deleted successfully.");
                        // Re-fetch the list using the token
                        fetchStudents(token); 

                    } catch (err) {
                        const status = err.response?.status;
                        const data = err.response?.data;
                        
                        // LOG THE FULL ERROR DETAILS TO THE RN CONSOLE
                        console.error(`Deletion Error Status ${status}:`, data || err.message);
                        
                        let errorMessage = "Failed to delete student.";
                        if (status === 403) {
                            errorMessage = "Permission Denied. Are you logged in as an Admin?";
                        } else if (status === 404) {
                            errorMessage = "Student not found.";
                        } else if (status === 500) {
                            errorMessage = "Internal Server Error (Check Django logs for ProtectedError).";
                        }
                        
                        Alert.alert("Error", errorMessage);
                        setIsLoading(false);
                    }
                }
            }
        ]
    );
};

    const handleEditStudent = (studentData) => {
        // Navigate to a new screen for editing the student's details
        // You'll need to create this 'EditStudent' screen and define the route in your navigator.
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

                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteStudent(item.id)}
                >
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
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