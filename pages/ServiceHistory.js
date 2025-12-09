// servicehistory.js - UA DESIGN IMPLEMENTED

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, Button, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://uact-backend.onrender.com/api/service-history/'; 

export default function ApplicationRecords() {
    const navigation = useNavigation();
    
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            setIsLoading(true);
            try {
                const token = await AsyncStorage.getItem('userToken');

                if (!token) {
                    setError("Unauthorized. Please log in.");
                    return;
                }

                const response = await axios.get(API_BASE_URL, {
                    headers: { 'Authorization': `Token ${token}` }
                });
                
                setApplications(response.data); 
                
            } catch (err) {
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

    const renderApplicationItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.cardHeader}>
                Program: {item.program.name}
            </Text>
            <Text style={styles.detailText}>
                Submitted On: {new Date(item.submitted_at).toLocaleDateString()}
            </Text>
            <Text style={styles.detailText}>Hours: {item.program.hours}</Text>
            <Text style={styles.detailText}>
                Status: {(item.current_status || 'N/A').toUpperCase()}
            </Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#001e66" />
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
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}
        >
        <View style={styles.container}>
            <Text style={styles.mainHeader}>
                Program Applications ({applications.length})
            </Text>
            
            <FlatList
                data={applications}
                keyExtractor={item => item.id.toString()}
                renderItem={renderApplicationItem}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No applications submitted yet.</Text>
                }
            />
        </View>
        </ImageBackground>
    );
}

// ----------------------------------------------------
// UA DESIGN STYLES (BLUE #001e66, RED #cf1a24, YELLOW #ffd800)
// ----------------------------------------------------

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        resizeMode: 'cover',
    },

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.85)',
    },

    mainHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#001e66',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 10,
    },

    itemContainer: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 6,
        borderLeftColor: '#cf1a24', // UA RED ACCENT
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },

    cardHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#001e66',
        marginBottom: 6,
    },

    detailText: {
        fontSize: 16,
        color: '#001e66',
        marginBottom: 3,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    errorText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#cf1a24',
        textAlign: 'center',
        marginBottom: 10,
    },

    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#001e66',
        marginTop: 20,
    },
});
