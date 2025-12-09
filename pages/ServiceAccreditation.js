import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 💡 IMPORTANT: You must import useFocusEffect from React Navigation
import { useFocusEffect } from '@react-navigation/native';
import styles from '../styles';

const API_BASE_URL = 'https://uact-backend.onrender.com/api';

export default function ServiceAccreditation() {
    const [serviceLogs, setServiceLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                setError("You must be logged in to view service accreditation.");
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/accreditation/`, {
                headers: { Authorization: `Token ${token}` }
            });

            // ⚠️ Ensure the Django serializer (ServiceLogAccreditationSerializer)
            // returns 'submission_accepted' field for this to work correctly.
            setServiceLogs(response.data || []);
        } catch (err) {
            console.error("Error fetching logs:", err.response?.data || err.message);
            setError("Failed to load service logs.");
        } finally {
            setLoading(false);
        }
    }, []);

    // This hook runs fetchLogs() every time the screen becomes the main focus.
    useFocusEffect(
        useCallback(() => {
            fetchLogs();
        }, [fetchLogs])
    );

    const handleApprove = async (logId) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                Alert.alert("Error", "You must be logged in to approve.");
                return;
            }

            // POST request to manually approve the log (triggering hours credit in Django)
            await axios.post(`${API_BASE_URL}/accreditation/${logId}/approve/`, {}, {
                headers: { Authorization: `Token ${token}` }
            });

            Alert.alert("Success", "Service log approved and hours credited!");

            // Re-fetch to update the UI immediately
            fetchLogs(); 

        } catch (err) {
            console.error("Error approving log:", err.response?.data || err.message);
            Alert.alert("Error", "Failed to approve log. Check console for details.");
        }
    };

    const formatStatus = (status) => {
        if (!status) return 'N/A';
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    };

    if (loading) {
        return (
            <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red', marginBottom: 10 }}>❌ {error}</Text>
            </View>
        );
    }

    if (serviceLogs.length === 0) {
        return (
            <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'gray', marginBottom: 10 }}>
                    No service logs found.
                </Text>
            </View>
        );
    }

    const LogEntry = ({ log }) => {
        // Final manual accreditation status (set by the button on this screen)
        const isApproved = log.approved;
        
        // Automatic submission status (set by ReviewSubmissions.js signal)
        // If 'submission_accepted' is undefined (e.g., missing from serializer), default to false.
        const isSubmissionAccepted = log.submission_accepted === true;
        
        // Disable button if already approved OR if the submission wasn't accepted
        const isButtonDisabled = isApproved || !isSubmissionAccepted;

        // Color for the date-based log status
        const dateStatusColor = isApproved ? 'green' : (log.status === 'completed' ? 'orange' : 'gray');
        
        // Style for the entire entry container (assuming you want borders/padding)
        const entryStyle = {
            padding: 15,
            marginBottom: 10,
            backgroundColor: '#f9f9f9',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#e0e0e0',
        };

        return (
            <View key={log.id} style={entryStyle}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
                    👤 {log.student_full_name || 'N/A'} 
                </Text>
                <Text style={{ fontSize: 16, marginBottom: 5 }}>
                    Program: {log.program?.name || 'N/A'} | 
                    Facilitator: {log.program?.facilitator || 'N/A'}
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 10 }}>
                    Hours: {log.program?.hours || 'N/A'} | Y&S: {log.course_section || 'N/A'}
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 10 }}>
                    Emergency: {log.emergency_contact_name} ({log.emergency_contact_phone})
                </Text>
                
                {/* --- STATUS DISPLAY --- */}
                <View style={{ marginBottom: 10, paddingVertical: 5, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                        ✅ Submission Accepted: 
                        <Text style={{ color: isSubmissionAccepted ? 'darkgreen' : 'darkred' }}>
                            {isSubmissionAccepted ? ' Yes' : ' No'} 
                        </Text>
                    </Text>
                    
                    <Text style={{ fontWeight: 'bold', color: dateStatusColor, marginTop: 5 }}>
                        📅 Date Status: {formatStatus(log.status)}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: isApproved ? 'green' : 'black' }}>
                        Final Approved: {isApproved ? 'Yes' : 'No'}
                    </Text>
                    
                    {/* --- MANUAL APPROVAL BUTTON --- */}
                    <TouchableOpacity
                        onPress={() => handleApprove(log.id)}
                        disabled={isButtonDisabled}
                        style={{ 
                            backgroundColor: isButtonDisabled ? '#9e9e9e' : '#007bff', 
                            padding: 10, 
                            borderRadius: 5 
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                            {isApproved ? "Hours Credited" : "Approve Hours"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { flex: 1, paddingTop: 40, alignItems: 'center' }]}>
            <View style={{
                width: '95%',
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
                    backgroundColor: 'rgb(0, 30, 102)',
                    elevation: 4,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e6e6e6'
                }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>Service Logs</Text>
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingVertical: 20 }}>
                    {serviceLogs.map((log) => (
                        <LogEntry key={log.id} log={log} />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}