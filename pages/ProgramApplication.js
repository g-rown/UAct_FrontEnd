// pages/ProgramApplication.js
import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    ScrollView, 
    ActivityIndicator 
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// Function to fetch the auth token (assuming this exists outside the component or is defined here)
// If you defined this function elsewhere (e.g., in a utilities file), you can keep that version.
const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        return token;
    } catch (e) {
        console.error("Failed to fetch token:", e);
        return null;
    }
};

export default function ProgramApplication({ route, navigation }) {
    // 🔑 FIX: Ensure 'program' is correctly destructured from 'route.params'
    const { program } = route.params;

    const API_URL = "http://127.0.0.1:8000/api/applications/";

    // 1. Authentication State
    const [authToken, setAuthToken] = useState(null);

    // 2. Submission Lock State (The new fix for double submission)
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // 3. Form State
    const [form, setForm] = useState({
        emergency_contact_name: '',
        emergency_contact_phone: '',
    });

    const handleChange = (name, value) => {
        setForm({
            ...form,
            [name]: value
        });
    };

    // Existing useEffect for loading token
    useEffect(() => {
        const loadToken = async () => {
            const token = await getAuthToken();
            setAuthToken(token);
        };
        loadToken();
    }, []);

    const handleSubmit = async () => {
        // Validation check for empty fields (optional, but good practice)
        if (!form.emergency_contact_name || !form.emergency_contact_phone) {
             Alert.alert("Validation Error", "Please fill in all emergency contact fields.");
             return;
        }

        if (!authToken || isSubmitting) { 
            if (isSubmitting) return; 
            Alert.alert("Error", "Authentication token is missing. Please log in again.");
            return;
        }
        
        // 🔑 STEP 1: Set submission state to true immediately
        setIsSubmitting(true); 

        const payload = {
            ...form,
            // CRITICAL: Send program_id which is expected by the backend serializer
            program_id: program.id, 
        };

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Token ${authToken}` 
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorJson = JSON.parse(errorText);
                    let errorMessage = "An unknown error occurred.";

                    if (errorJson.detail) {
                        errorMessage = errorJson.detail;
                    } else if (Object.keys(errorJson).length > 0) {
                        // Handle serializer errors (e.g., if program_id fails validation)
                         errorMessage = Object.keys(errorJson).map(key => `${key.replace(/_/g, ' ')}: ${errorJson[key].join(', ')}`).join('\n');
                    } else {
                        errorMessage = JSON.stringify(errorJson, null, 2);
                    }
                    
                    console.error(`HTTP Error ${response.status}:`, errorJson);
                    Alert.alert(`Submission Failed (${response.status})`, errorMessage);
                } catch (e) {
                    console.error("Server Error (Non-JSON Response):", errorText);
                    console.error("Original parsing error:", e);
                    
                    Alert.alert(
                        `Submission Failed (${response.status})`, 
                        "Internal Server Error (Non-JSON Response). Check the backend console."
                    );
                }
                return; 
            }
            
            // Success path
            // const data = await response.json(); // You can comment this out if not needed
            Alert.alert("Success", "Application Submitted!");
            navigation.goBack();

        } catch (error) {
            console.error("Network or Fetch Initialization Error:", error);
            Alert.alert("Network Error", "Could not connect to the server.");
        } finally {
             // 🔑 STEP 2: Always reset submission state
             setIsSubmitting(false); 
        }
    };

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
                Apply for: {program.name} 📝
            </Text>

            {/* Application Information */}
            <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 5 }}>
                <Text style={{ fontWeight: 'bold', color: '#007bff' }}>Program Details</Text>
                <Text>Location: {program.location}</Text>
                <Text>Date: {program.date}</Text>
                <Text>Hours: {program.hours}</Text>
            </View>

            {/* Form Fields */}
            {Object.keys(form).map((key) => (
                <View key={key} style={{ marginTop: 15 }}>
                    <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                        {key.replace(/_/g, " ").toUpperCase()}
                    </Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 5,
                            padding: 10
                        }}
                        value={form[key]}
                        onChangeText={(value) => handleChange(key, value)}
                        // Disable input fields while submitting
                        editable={!isSubmitting} 
                    />
                </View>
            ))}

            <TouchableOpacity
                onPress={handleSubmit}
                // 🔑 STEP 3: Disable button if token is missing OR if submitting
                disabled={!authToken || isSubmitting} 
                style={{
                    marginTop: 30,
                    padding: 15,
                    // Change color based on submission state
                    backgroundColor: (authToken && !isSubmitting) ? "#28a745" : "#6c757d", 
                    borderRadius: 5
                }}
            >
                <Text style={{ color: "#fff", textAlign: "center", fontSize: 16 }}>
                    {/* 🔑 STEP 4: Show a loading indicator while submitting */}
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        authToken ? "Submit Application" : "Loading Authentication..."
                    )}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}