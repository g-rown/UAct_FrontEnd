// pages/CommunityPrograms.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
// 🔑 NEW: Import AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function CommunityPrograms() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const API_URL = "http://127.0.0.1:8000/api/programs/";

    // 🚀 MODIFIED: Changed useEffect to an async function to retrieve the token
    useEffect(() => {
        const fetchPrograms = async () => {
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

            <TouchableOpacity
                style={{
                    marginTop: 10,
                    padding: 10,
                    backgroundColor: "#0066cc",
                    borderRadius: 5
                }}
                onPress={() => navigation.navigate("ProgramApplication", { program: item })}
            >
                <Text style={{ color: "#fff", textAlign: "center" }}>Apply</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 15 }}>Community Programs</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <FlatList
                    data={programs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProgram}
                />
            )}
        </View>
    );
}