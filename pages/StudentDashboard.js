import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles';

export default function StudentDashboard() {
    const navigation = useNavigation();

    return (
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}
        >
            <View style={styles.container}>
                
                <Text style={styles.dashboardWelcome}>
                    Welcome, Student!
                </Text>

                {/* View Programs Button */}
                <TouchableOpacity 
                    style={styles.dashboardButton}
                    onPress={() => navigation.navigate('CommunityPrograms')}
                >
                    <Text style={styles.dashboardButtonText}>
                        View Available Programs
                    </Text>
                </TouchableOpacity>

                {/* Service History Button */}
                <TouchableOpacity 
                    style={styles.dashboardButton}
                    onPress={() => navigation.navigate('ServiceHistory')}
                >
                    <Text style={styles.dashboardButtonText}>
                        Review Service History
                    </Text>
                </TouchableOpacity>

            </View>
        </ImageBackground>
    );
}
