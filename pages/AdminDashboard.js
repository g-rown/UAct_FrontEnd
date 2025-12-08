import React, { useState, useEffect } from 'react';
import { View, Text, Button, ImageBackground, ScrollView, ActivityIndicator, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles';

export default function AdminDashboard() {
    const navigation = useNavigation();

    return (
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}
        >
            <View style={styles.container}>
                <Text style={styles.welcomeText}>
                    Welcome, Admin!
                </Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.halfButton}
                        onPress={() => navigation.navigate('ManageStudents')}
                    >
                        <Text style={styles.halfButtonText}>
                            Manage Students
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.halfButton}
                        onPress={() => navigation.navigate('ManagePrograms')}
                    >
                        <Text style={styles.halfButtonText}>
                            Manage Programs
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.halfButton}
                        onPress={() => navigation.navigate('ReviewSubmissions')}
                    >
                        <Text style={styles.halfButtonText}>
                            Review Submissions
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.halfButton}
                        onPress={() => navigation.navigate('ServiceAccreditation')}
                    >
                        <Text style={styles.halfButtonText}>
                            Service Accreditation
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}
