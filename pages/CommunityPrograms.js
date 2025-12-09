import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ImageBackground, // Import StyleSheet for better design
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// --- COLOR PALETTE ---
const COLORS = {
    primaryBlue: '#001e66', // Blue shade
    primaryRed: '#cf1a24',   // Red shade
    primaryYellow: '#ffd800',// Yellow shade
    backgroundLight: '#f0f4f7', // Light background for the screen
    textDark: '#333333',
    textLight: '#ffffff',
};

// --- FONT FAMILY (Assuming DM Sans is available in your environment) ---
// If 'DMSans' is not a system font, you might need to load it using expo-font or similar.
const FONT_FAMILY = ''; 
const FONT_FAMILY_BOLD = ''; // Assuming a bold variant is available

export default function CommunityPrograms() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for handling fetch errors

    const navigation = useNavigation();

    // Use a variable for the API URL
    const API_URL = "https://uact-backend.onrender.com/api/programs/";

    useEffect(() => {
        const fetchPrograms = async () => {
            let token = null;
            try {
                // 1. Retrieve the token from storage
                token = await AsyncStorage.getItem('userToken');

                if (!token) {
                    console.error("Token not found. Cannot fetch programs.");
                    setError("Authentication required. Please log in.");
                    return;
                }
                
                // 2. Make the authenticated fetch request
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                });

                // 3. Handle non-200 responses
                if (!response.ok) {
                    const errorData = await response.json();
                    const message = errorData.detail || 'Failed to fetch programs.';
                    setError(message);
                    throw new Error(message);
                }

                const data = await response.json();
                
                // 4. Update state with program data
                setPrograms(data);

            } catch (err) {
                console.error("Fetch Error:", err.message);
                if (!error) { // Only set generic error if no specific auth error was set
                     setError("Could not connect to the server or fetch data.");
                }
            } finally {
                // 5. Always set loading to false
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []); 

    // Improved render item function
    const renderProgram = ({ item }) => (
        <View style={styles.programCard}>
            <Text style={styles.programTitle}>{item.name}</Text>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Facilitator:</Text>
                <Text style={styles.infoValue}>{item.facilitator}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Location:</Text>
                <Text style={styles.infoValue}>{item.location}</Text>
            </View>
            
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Date:</Text>
                <Text style={styles.infoValue}>{item.date}</Text>
            </View>
            
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hours:</Text>
                <Text style={styles.infoValue}>{item.hours}</Text>
            </View>

            <Text style={styles.programDescription}>{item.description}</Text>
            
            <View style={styles.slotsContainer}>
                <Text style={styles.slotsText}>
                    Slots Remaining: 
                    <Text style={styles.slotsValue}> {item.slots_remaining}</Text>
                </Text>
            </View>

            <TouchableOpacity
                style={styles.applyButton}
                onPress={() => navigation.navigate("ProgramApplication", { program: item })}
            >
                <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}>
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Community Programs</Text>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primaryBlue} style={styles.loadingIndicator} />
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>🚨 Error Loading Programs</Text>
                    <Text style={styles.errorDetail}>{error}</Text>
                </View>
            ) : programs.length === 0 ? (
                 <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No programs available at the moment.</Text>
                </View>
            ) : (
                <FlatList
                    data={programs}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderProgram}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
        </ImageBackground>
    );
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
        paddingHorizontal: 20,
        paddingTop: 40, // More space at the top
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: FONT_FAMILY_BOLD, 
        color: COLORS.primaryBlue,
        marginBottom: 20,
        textAlign: 'center',
        borderBottomWidth: 3,
        borderBottomColor: COLORS.primaryYellow,
        paddingBottom: 5,
    },
    listContent: {
        paddingBottom: 20,
    },
    // --- Program Card Styling ---
    programCard: {
        backgroundColor: COLORS.textLight, // White background
        padding: 20,
        marginVertical: 8,
        borderRadius: 12,
        shadowColor: COLORS.primaryBlue, // Use blue for a subtle, professional shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5, // Android shadow
        borderLeftWidth: 5,
        borderLeftColor: COLORS.primaryRed, // Add a striking color accent
    },
    programTitle: {
        fontSize: 22,
        fontFamily: FONT_FAMILY_BOLD,
        color: COLORS.primaryBlue,
        marginBottom: 10,
    },
    programDescription: {
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        color: COLORS.textDark,
        marginTop: 10,
        lineHeight: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    infoLabel: {
        fontFamily: FONT_FAMILY_BOLD,
        fontSize: 14,
        color: COLORS.textDark,
        marginRight: 5,
    },
    infoValue: {
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        color: COLORS.textDark,
    },
    // --- Slots Remaining Styling ---
    slotsContainer: {
        marginTop: 10,
        paddingVertical: 5,
    },
    slotsText: {
        fontFamily: FONT_FAMILY,
        fontSize: 14,
        color: COLORS.textDark,
    },
    slotsValue: {
        fontFamily: FONT_FAMILY_BOLD,
        color: COLORS.primaryRed, // Highlight remaining slots in red
    },
    // --- Apply Button Styling ---
    applyButton: {
        marginTop: 15,
        padding: 12,
        backgroundColor: COLORS.primaryBlue,
        borderRadius: 8,
        alignItems: 'center',
        // Optional: Add a shadow to the button
        shadowColor: COLORS.primaryBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    applyButtonText: {
        color: COLORS.textLight,
        fontSize: 16,
        fontFamily: FONT_FAMILY_BOLD,
        textTransform: 'uppercase',
    },
    // --- Utility Styles ---
    loadingIndicator: {
        marginTop: 50,
    },
    errorContainer: {
        marginTop: 50,
        padding: 20,
        backgroundColor: '#fdd',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.primaryRed,
    },
    errorText: {
        fontSize: 18,
        fontFamily: FONT_FAMILY_BOLD,
        color: COLORS.primaryRed,
        marginBottom: 5,
    },
    errorDetail: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: COLORS.textDark,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        color: COLORS.textDark,
    }
});