import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    ScrollView, 
    ActivityIndicator,
    StyleSheet,
    ImageBackground,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// --- COLOR PALETTE ---
const COLORS = {
    primaryBlue: '#001e66', // Blue shade
    primaryRed: '#cf1a24',   // Red shade
    primaryYellow: '#ffd800',// Yellow shade
    backgroundLight: '#f0f4f7', 
    textDark: '#333333',
    textLight: '#ffffff',
    successGreen: '#28a745', 
    disabledGray: '#6c757d',
};

// --- FONT FAMILY ---
const FONT_FAMILY = 'DM Sans'; 
const FONT_FAMILY_BOLD = 'DM Sans Bold'; 

// Function to fetch the auth token
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
    const { program } = route.params;

    const API_URL = "https://uact-backend.onrender.com/api/applications/";

    const [authToken, setAuthToken] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 

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

    useEffect(() => {
        const loadToken = async () => {
            const token = await getAuthToken();
            setAuthToken(token);
        };
        loadToken();
    }, []);

    const handleSubmit = async () => {
        if (!form.emergency_contact_name || !form.emergency_contact_phone) {
             Alert.alert("Validation Error", "Please fill in all emergency contact fields.");
             return;
        }

        if (!authToken || isSubmitting) { 
            if (isSubmitting) return; 
            Alert.alert("Error", "Authentication token is missing. Please log in again.");
            return;
        }
        
        setIsSubmitting(true); 

        const payload = {
            ...form,
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
            
            Alert.alert("Success", `Your application for ${program.name} has been submitted!`);
            navigation.goBack();

        } catch (error) {
            console.error("Network or Fetch Initialization Error:", error);
            Alert.alert("Network Error", "Could not connect to the server.");
        } finally {
             setIsSubmitting(false); 
        }
    };

    return (
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            
            <Text style={styles.headerTitle}>Program Application</Text>

            {/* Program Details Card */}
            <View style={styles.programDetailCard}>
                <Text style={styles.programName}>{program.name}</Text>
                
                {/* Each detail is wrapped in a View to center it vertically */}
                <View style={styles.detailBlock}>
                    <Text style={styles.detailLabelText}>Facilitator:</Text>
                    <Text style={styles.detailValueText}>{program.facilitator}</Text>
                </View>

                <View style={styles.detailBlock}>
                    <Text style={styles.detailLabelText}>Location:</Text>
                    <Text style={styles.detailValueText}>{program.location}</Text>
                </View>

                <View style={styles.detailBlock}>
                    <Text style={styles.detailLabelText}>Date:</Text>
                    <Text style={styles.detailValueText}>{program.date}</Text>
                </View>

                <View style={styles.detailBlock}>
                    <Text style={styles.detailLabelText}>Hours:</Text>
                    <Text style={styles.detailValueText}>{program.hours}</Text>
                </View>

                {/* Description is kept as a single Text element */}
                <View style={styles.detailBlock}>
                    <Text style={styles.detailLabelText}>Description:</Text>
                    <Text style={[styles.detailValueText, styles.descriptionValue]}>{program.description}</Text>
                </View>
            </View>

            <Text style={styles.sectionHeader}>Emergency Contact Information</Text>

            {/* Form Fields */}
            {Object.keys(form).map((key) => (
                <View key={key} style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                        {key.replace(/_/g, " ").toUpperCase()}
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        value={form[key]}
                        onChangeText={(value) => handleChange(key, value)}
                        editable={!isSubmitting} 
                        placeholder={
                            key === 'emergency_contact_name' 
                                ? 'e.g., Jane Doe' 
                                : 'e.g., 555-123-4567'
                        }
                        keyboardType={
                            key.includes('phone') ? 'phone-pad' : 'default'
                        }
                    />
                </View>
            ))}

            <TouchableOpacity
                onPress={handleSubmit}
                disabled={!authToken || isSubmitting} 
                style={[
                    styles.submitButton, 
                    { 
                        backgroundColor: isSubmitting 
                            ? COLORS.disabledGray 
                            : COLORS.primaryBlue 
                    }
                ]}
            >
                {isSubmitting ? (
                    <ActivityIndicator color={COLORS.textLight} />
                ) : (
                    <Text style={styles.submitButtonText}>
                        {authToken ? "Submit Application" : "Loading Authentication..."}
                    </Text>
                )}
            </TouchableOpacity>
            
            {/* Optional: Add a brief policy/reminder */}
            <Text style={styles.policyText}>
                By submitting this form, you agree to comply with program policies.
            </Text>

        </ScrollView>
        </ImageBackground>
    );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    scrollContent: {
        padding: 20,
    },
    headerTitle: {
        fontSize: 30,
        fontFamily: FONT_FAMILY_BOLD, 
        color: COLORS.primaryBlue,
        marginBottom: 20,
        textAlign: 'center',
        borderBottomWidth: 3,
        borderBottomColor: COLORS.primaryYellow,
        paddingBottom: 5,
    },
    // --- Program Details Card ---
    programDetailCard: {
        backgroundColor: COLORS.textLight,
        padding: 20,
        marginBottom: 20,
        borderRadius: 12,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.primaryRed,
        shadowColor: COLORS.primaryBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        // 🔑 KEY CHANGE: Center card contents horizontally
        alignItems: 'center', 
    },
    programName: {
        fontSize: 22,
        fontFamily: FONT_FAMILY_BOLD,
        color: COLORS.primaryBlue,
        marginBottom: 8,
        textAlign: 'center', // 🔑 Center the title text
        width: '100%',
    },
    // 🔑 NEW BLOCK STYLE: Wraps label and value, centers itself within the card
    detailBlock: {
        marginBottom: 8,
        alignItems: 'center', // Centers the label and value within this block
        width: '100%', 
    },
    detailLabelText: {
        // Label text uses FONT_FAMILY (regular)
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: COLORS.textDark,
        marginBottom: 2, // Space between label and value
        textAlign: 'center', // 🔑 Center label text
    },
    // The actual value will use this bold style
    detailValueText: {
        fontFamily: FONT_FAMILY_BOLD,
        color: COLORS.textDark,
        textAlign: 'center', // 🔑 Center value text
        paddingHorizontal: 5, // Optional: gives value text some breathing room
    },
    descriptionValue: {
        fontFamily: FONT_FAMILY, // Description is often better read in regular font
        marginTop: 5,
        lineHeight: 20,
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    sectionHeader: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_BOLD,
        color: COLORS.textDark,
        marginTop: 10,
        marginBottom: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    // --- Form Fields ---
    inputGroup: {
        marginTop: 15,
    },
    inputLabel: {
        fontFamily: FONT_FAMILY_BOLD,
        fontSize: 14,
        color: COLORS.primaryBlue,
        marginBottom: 5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        backgroundColor: COLORS.textLight,
        color: COLORS.textDark,
    },
    // --- Submission Button ---
    submitButton: {
        marginTop: 30,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: COLORS.primaryBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    submitButtonText: {
        color: COLORS.textLight,
        textAlign: "center",
        fontSize: 18,
        fontFamily: FONT_FAMILY_BOLD,
        textTransform: 'uppercase',
    },
    policyText: {
        marginTop: 20,
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        color: COLORS.disabledGray,
        textAlign: 'center',
    }
});