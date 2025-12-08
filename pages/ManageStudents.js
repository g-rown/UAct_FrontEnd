import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, Pressable } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function ManageStudents() {
    const navigation = useNavigation();

    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [authToken, setAuthToken] = useState(null);

    // Delete Modal state
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // ---------------- FETCH STUDENTS ----------------
    const fetchStudents = async (token) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/students/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setStudents(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching students:", err.response?.data || err.message);
            let errorMessage = "Failed to load students.";
            if (err.response && err.response.status === 403) {
                errorMessage = "Access Denied: You must be an Admin to view this list.";
            } else if (err.response) {
                errorMessage = `Server Error (${err.response.status}): ${JSON.stringify(err.response.data)}`;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // ---------------- LOAD TOKEN + FETCH ----------------
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

    // ---------------- DELETE STUDENT ----------------
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
            console.error("Delete error:", err.response?.data || err.message);
            alert(err.response?.data?.detail || "Could not delete student.");
        } finally {
            setDeleteModalVisible(false);
            setSelectedStudent(null);
        }
    };

    // ---------------- EDIT STUDENT ----------------
    const handleEditStudent = (studentData) => {
        navigation.navigate('EditStudent', { student: studentData });
    };

    // ---------------- LOADING VIEW ----------------
    if (isLoading) {
        return (
            <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Loading Student Data...</Text>
            </View>
        );
    }

    // ---------------- ERROR VIEW ----------------
    if (error) {
        return (
            <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: '#007bff' }}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ---------------- MAIN VIEW ----------------
    return (
        <View style={[styles.container, { flex: 1, paddingTop: 40, alignItems: 'center' }]}>
            <View style={{
                width: '50%',
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
                    backgroundColor: '#f0f0f0',
                    elevation: 4,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e6e6e6'
                }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Students</Text>
                </View>

                {/* STUDENT CARDS */}
                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingVertical: 20 }}>
                    {students.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
                            No students found.
                        </Text>
                    ) : students.map(student => (
                        <View key={student.id} style={{
                            backgroundColor: '#fff',
                            padding: 15,
                            borderRadius: 12,
                            marginBottom: 15,
                            elevation: 3,
                            borderWidth: 1,
                            borderColor: '#ececec'
                        }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
                                {student.user.first_name} {student.user.last_name}
                            </Text>

                            <View style={{ marginLeft: 5, marginBottom: 10 }}>
                                <Text>Email: {student.user.email}</Text>
                                <Text>Course/Year/Section: {student.course}/{student.year_level}/{student.section}</Text>
                                <Text>Hours Completed: {student.hours_completed} / {student.total_required_hours}</Text>
                            </View>

                            {/* Buttons */}
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: '#007bff',
                                        paddingVertical: 6,
                                        paddingHorizontal: 15,
                                        borderRadius: 8
                                    }}
                                    onPress={() => handleEditStudent(student)}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: 'red',
                                        paddingVertical: 6,
                                        paddingHorizontal: 15,
                                        borderRadius: 8,
                                        marginLeft: 10
                                    }}
                                    onPress={() => confirmDeleteStudent(student)}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* ---------------- DELETE MODAL ---------------- */}
            <Modal
                visible={deleteModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: '40%',
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 20,
                        elevation: 5
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Confirm Delete</Text>
                        <Text style={{ marginBottom: 20 }}>
                            Are you sure you want to delete {selectedStudent?.user.first_name} {selectedStudent?.user.last_name}?
                        </Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <Pressable
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 15,
                                    borderRadius: 8,
                                    marginLeft: 10,
                                    backgroundColor: '#ccc'
                                }}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
                            </Pressable>

                            <Pressable
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 15,
                                    borderRadius: 8,
                                    marginLeft: 10,
                                    backgroundColor: 'red'
                                }}
                                onPress={handleDeleteStudent}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}