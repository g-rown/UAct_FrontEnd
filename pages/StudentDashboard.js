import React, { useState, useEffect } from 'react';
import { View, Text, Button, ImageBackground, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';

import styles from '../styles';

const API_BASE_URL = 'http://127.0.0.1:8000/api/'; 
const PROGRESS_ENDPOINT = 'progress-summary/'

const StudentInfoCard = ({ firstName, lastName, studentID, course, yearLevel, section }) => (
    <View style={localStyles.infoCard}>
        <Text style={localStyles.infoName}>{firstName} {lastName}</Text>
        <View style={localStyles.infoRow}>
            <Text style={localStyles.infoLabel}>ID:</Text>
            {/* The backend doesn't seem to provide a dedicated student_id field, 
                so we'll display the username for now, which often serves as an ID */}
            <Text style={localStyles.infoValue}>{studentID}</Text> 
        </View>
        <View style={localStyles.infoRow}>
            <Text style={localStyles.infoLabel}>Course:</Text>
            <Text style={localStyles.infoValue}>{course}</Text>
        </View>
        <View style={localStyles.infoRow}>
            <Text style={localStyles.infoLabel}>Year/Section:</Text>
            <Text style={localStyles.infoValue}>{yearLevel} - {section}</Text>
        </View>
    </View>
);

export default function StudentDashboard() {
    const navigation = useNavigation();

    const [dashboardData, setDashboardData] = useState(null);

    // State to hold the progress data
    const [hoursCompleted, setHoursCompleted] = useState(0);
    const [totalRequiredHours, setTotalRequiredHours] = useState(80);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Fetch the progress data
    const fetchDashboardData = async () => { // Renamed from fetchProgress for clarity
        setIsLoading(true);
        setFetchError(null);

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                throw new Error("User not authenticated. No token found.");
            }

            const response = await fetch(`${API_BASE_URL}${PROGRESS_ENDPOINT}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Failed to fetch data: ${response.status}`);
            }

            // --- KEY CHANGE: Store the entire data object ---
            const data = await response.json();
            setDashboardData(data); // Stores the full response (user, course, hours_completed, etc.)
            
        } catch (error) {
            console.error("API Error:", error.message);
            setFetchError(error.message);
            Alert.alert("Error", `Could not load dashboard data: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []); 

    // --- Loading and Error Handling (unmodified) ---
    if (isLoading) {
        return (
            <View style={[styles.container, localStyles.loadingContainer]}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Loading dashboard data...</Text>
            </View>
        );
    }

    if (fetchError || !dashboardData) {
        return (
            <View style={[styles.container, localStyles.loadingContainer]}>
                <Text style={localStyles.errorText}>Error: {fetchError || "No data received."}</Text>
                {/* Note: Added Button to call the fetch function */}
                <Button title="Try Again" onPress={fetchDashboardData} /> 
            </View>
        );
    }
    
    // --- Destructure data for cleaner rendering ---
    const { 
        user, 
        course, 
        year_level, 
        section, 
        hours_completed, 
        total_required_hours 
    } = dashboardData;

    const hoursCompletedValue = hours_completed || 0;
    const totalRequiredHoursValue = total_required_hours || 80;

    const progressPercentage = hoursCompletedValue / totalRequiredHoursValue;
    const hoursRemaining = totalRequiredHoursValue - hoursCompletedValue;

    return (
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}
        >
            <View style={[styles.container, localStyles.dashboardContent]}>
                <Text style={localStyles.welcomeText}>Welcome, Student!</Text>

                <StudentInfoCard 
                    firstName={user.first_name}
                    lastName={user.last_name}
                    studentID={user.username} 
                    course={course}
                    yearLevel={year_level}
                    section={section}
                />
                
                <View style={localStyles.summaryCard}>
                    <Text style={localStyles.summaryTitle}>Community Service Progress</Text>
                    
                    <Progress.Bar 
                        progress={progressPercentage} 
                        width={null} 
                        height={18}
                        color="#ffd800"
                        unfilledColor="#E0E0E0"
                        borderRadius={10}
                        borderWidth={0}
                        style={localStyles.progressBar}
                    /> 

                    <Text style={localStyles.hoursText}>
                        {hours_completed} / {totalRequiredHours} Hours Completed
                    </Text>
                    <Text style={localStyles.remainingText}>
                        {hoursRemaining} Hours Remaining
                    </Text>
                </View>

                {/* View Programs Button */}
                <View style={localStyles.buttonContainer}>
                    <TouchableOpacity 
                        style={localStyles.halfButton}
                        onPress={() => navigation.navigate('Programs')}
                    >
                        <Text style={styles.dashboardButtonText}>
                            View Available Programs
                        </Text>
                    </TouchableOpacity>

                            {/* Service History Button */}
                    <TouchableOpacity 
                        style={localStyles.halfButton}
                        onPress={() => navigation.navigate('History')}
                    >
                        <Text style={styles.dashboardButtonText}>
                            Review Service History
                        </Text>
                     </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}
        
const localStyles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    dashboardContent: {
        paddingTop: 50, 
        alignItems: 'center',
        flex: 1, 
    },

    infoCard: {
        backgroundColor: '#011C40', // Dark/primary background
        borderRadius: 15,
        padding: 20,
        width: '90%',
        marginBottom: 20, // Reduced space to keep it tighter than the progress card
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FFFFFF', // White text
        textAlign: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 3,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#dad6d6ff', // Light gray label
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF', // White value
    },

    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#011C40',
    },
    summaryCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '750',
        marginBottom: 15,
        textAlign: 'center',
        color: '#011C40',
    },
    progressBar: {
        marginBottom: 10,
        marginHorizontal: 5
    },
    hoursText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
        marginVertical: 5,
        color: '#011C40',
    },
    remainingText: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#011C40',
        fontWeight: '400',
    },

    buttonContainer: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        marginBottom: 30, 
        gap: 20
    },
    
    halfButton: {
        ...styles.dashboardButton, // Inherit base button styling
        flex: 1, 
        width: undefined, 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: 0, 
    },
});