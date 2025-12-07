import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';


const API_BASE_URL = 'http://127.0.0.1:8000/api';


export default function ReviewSubmissions() {
    const navigation = useNavigation();


    const [programs, setPrograms] = useState([]);
    const [expandedProgramId, setExpandedProgramId] = useState(null);
    const [expandedStudentId, setExpandedStudentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Modal states
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [decisionType, setDecisionType] = useState(null);


    useEffect(() => {
        fetchSubmissions();
    }, []);


const fetchSubmissions = async () => {
    setLoading(true);


    try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
            setError("Unauthorized. Please log in.");
            setLoading(false);
            return;
        }


        const response = await axios.get(
            `${API_BASE_URL}/applications/`,
            { headers: { Authorization: `Token ${token}` } }
        );


        console.log("📌 Raw applications:", response.data);


        const data = response.data || [];


        // Group by program
        const grouped = {};
        data.forEach(item => {
            const program = item.program;
            if (!program) return;


            if (!grouped[program.id]) {
                grouped[program.id] = {
                    ...program,
                    submissions: []
                };
            }


            grouped[program.id].submissions.push(item);
        });


        setPrograms(Object.values(grouped));


    } catch (err) {
        console.error("❌ Load error:", err.response?.data || err.message);
        setError("Failed to load submissions.");
    } finally {
        setLoading(false);
    }
};




    const toggleProgram = (id) => {
        setExpandedProgramId(expandedProgramId === id ? null : id);
        setExpandedStudentId(null);
    };


    const toggleStudent = (id) => {
        setExpandedStudentId(expandedStudentId === id ? null : id);
    };


    // 🔥 OPEN DECISION POPUP
    const openDecisionPopup = (submission, decision) => {
        setSelectedSubmission(submission);
        setDecisionType(decision);
        setModalVisible(true);
    };


    const closePopup = () => {
        setModalVisible(false);
        setSelectedSubmission(null);
        setDecisionType(null);
    };


    // 🔥 SEND DECISION TO BACKEND
    const handleDecision = async () => {
        if (!selectedSubmission || !decisionType) return;


        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error("User not logged in");


            await axios.post(
                `${API_BASE_URL}/programsubmissions/${selectedSubmission.id}/decide/`,
                { status: decisionType.toLowerCase() },
                { headers: { Authorization: `Token ${token}` } }
            );


            closePopup();
            fetchSubmissions();
        } catch (err) {
            console.error("Error updating submission:", err.response?.data || err.message);
        }
    };


    // --------------------------------
    // RENDER
    // --------------------------------


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
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: '#007bff' }}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        );
    }


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
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: '#f0f0f0',
                    borderBottomWidth: 1,
                }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Review Submissions</Text>
                </View>


                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ padding: 20 }}>
                    {programs.map(program => (
                        <View key={program.id}>
                            <TouchableOpacity
                                onPress={() => toggleProgram(program.id)}
                                style={{
                                    backgroundColor: '#fff',
                                    padding: 15,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#ececec',
                                    marginBottom: 10
                                }}
                            >
                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{program.name}</Text>
                                <Text style={{ marginTop: 5, color: '#555' }}>
                                    {program.description}{"\n"}
                                    Location: {program.location} | Facilitator: {program.facilitator}{"\n"}
                                    Date: {program.date} | Time: {program.time_start} - {program.time_end}{"\n"}
                                    Hours: {program.hours} | Slots: {program.slots} | Taken: {program.slots_taken} | Remaining: {program.slots_remaining}
                                </Text>
                            </TouchableOpacity>


                            {expandedProgramId === program.id && (
                                <View style={{
                                    backgroundColor: '#f9f9f9',
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    borderRadius: 10,
                                    marginBottom: 20,
                                }}>
                                    {program.submissions.map((submission, index) => {
                                        const student = submission.application.student;


                                        return (
                                            <View key={submission.id}>
                                                <TouchableOpacity
                                                    onPress={() => toggleStudent(submission.id)}
                                                    style={{ padding: 10 }}
                                                >
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                                        {student.user.full_name} - {student.CYS}
                                                    </Text>
                                                    <Text>Status: {submission.status}</Text>
                                                </TouchableOpacity>


                                                {expandedStudentId === submission.id && (
                                                    <View style={{ paddingLeft: 10, paddingBottom: 10 }}>
                                                        <Text>Emergency Contact: {submission.application.emergency_contact_name}</Text>
                                                        <Text>Phone: {submission.application.emergency_contact_phone}</Text>


                                                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                            <TouchableOpacity
                                                                style={{
                                                                    paddingVertical: 6,
                                                                    paddingHorizontal: 15,
                                                                    borderRadius: 8,
                                                                    backgroundColor: 'green'
                                                                }}
                                                                onPress={() => openDecisionPopup(submission, 'Approved')}
                                                            >
                                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Accept</Text>
                                                            </TouchableOpacity>


                                                            <TouchableOpacity
                                                                style={{
                                                                    paddingVertical: 6,
                                                                    paddingHorizontal: 15,
                                                                    borderRadius: 8,
                                                                    backgroundColor: 'red',
                                                                    marginLeft: 10
                                                                }}
                                                                onPress={() => openDecisionPopup(submission, 'Rejected')}
                                                            >
                                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reject</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )}


                                                {index < program.submissions.length - 1 && (
                                                    <View style={{ height: 1, backgroundColor: '#ccc', marginHorizontal: 10 }} />
                                                )}
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            </View>


            {/* ------------------- DECISION MODAL ------------------- */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closePopup}
            >
                <View style={modalStyles.modalOverlay}>
                    <View style={modalStyles.modalContainer}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
                            {decisionType} Submission
                        </Text>


                        <Text style={{ marginBottom: 20 }}>
                            Are you sure you want to mark this submission as {decisionType.toLowerCase()}?
                        </Text>


                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                style={[modalStyles.modalButton, { backgroundColor: '#ccc' }]}
                                onPress={closePopup}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                style={[modalStyles.modalButton, { backgroundColor: 'green', marginLeft: 10 }]}
                                onPress={handleDecision}
                            >
                                <Text style={{ color: '#fff' }}>{decisionType}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const modalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '40%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20
    },
    modalButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8
    }
});



