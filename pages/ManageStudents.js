import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Pressable } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles';

const API_BASE_URL = 'https://uact-backend.onrender.com/api';

export default function ManageStudents() {
    const navigation = useNavigation();

    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const fetchStudents = async (token) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/students/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setStudents(response.data);
            setError(null);
        } catch (err) {
            let errorMessage = "Failed to load students.";
            if (err.response?.status === 403) {
                errorMessage = "Access Denied: You must be an Admin to view this list.";
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

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

    const confirmDeleteStudent = (student) => {
        setSelectedStudent(student);
        setDeleteModalVisible(true);
    };

    const handleDeleteStudent = async () => {
        if (!selectedStudent) return;

        try {
            await axios.delete(`${API_BASE_URL}/students/${selectedStudent.id}/`, {
                headers: { Authorization: `Token ${authToken}` }
            });
            fetchStudents(authToken);
        } catch (err) {
            alert("Could not delete student.");
        } finally {
            setDeleteModalVisible(false);
            setSelectedStudent(null);
        }
    };

    const handleEditStudent = (studentData) => {
        navigation.navigate('EditStudent', { student: studentData });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#001e66" />
                <Text style={styles.loadingText}>Loading Student Data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.goToLoginText}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.manageMainContainer}>
            <View style={styles.manageContentBox}>
                <View style={styles.manageHeader}>
                    <Text style={styles.manageHeaderText}>Students</Text>
                </View>

                <ScrollView style={styles.studentScroll} contentContainerStyle={styles.studentScrollContent}>
                    {students.length === 0 ? (
                        <Text style={styles.noStudentText}>No students found.</Text>
                    ) : students.map(student => (
                        <View key={student.id} style={styles.studentCard}>
                            <Text style={styles.studentName}>
                                {student.user.first_name} {student.user.last_name}
                            </Text>

                            <View style={styles.studentInfoBox}>
                                <Text style={styles.studentInfoText}>Email: {student.user.email}</Text>
                                <Text style={styles.studentInfoText}>
                                    Course/Year/Section: {student.course}/{student.year_level}/{student.section}
                                </Text>
                                <Text style={styles.studentInfoText}>
                                    Hours Completed: {student.hours_completed} / {student.total_required_hours}
                                </Text>
                            </View>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => handleEditStudent(student)}
                                >
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => confirmDeleteStudent(student)}
                                >
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* DELETE MODAL */}
            <Modal
                visible={deleteModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Confirm Delete</Text>
                        <Text style={styles.modalMessage}>
                            Are you sure you want to delete {selectedStudent?.user.first_name} {selectedStudent?.user.last_name}?
                        </Text>

                        <View style={styles.modalButtonRow}>
                            <Pressable style={styles.modalCancelButton} onPress={() => setDeleteModalVisible(false)}>
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </Pressable>

                            <Pressable style={styles.modalDeleteButton} onPress={handleDeleteStudent}>
                                <Text style={styles.modalDeleteText}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
