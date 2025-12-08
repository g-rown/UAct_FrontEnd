import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function ReviewSubmissions() {
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);

  // Fetch programs
  const fetchPrograms = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/programs/`, {
        headers: { Authorization: `Token ${token}` },
      });
      setPrograms(response.data);
    } catch (err) {
      setError('Failed to load programs.');
      console.log(err);
    } finally {
      setLoadingPrograms(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Fetch submissions
  const fetchSubmissions = async (programId) => {
    setLoadingSubmissions(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(
        `${API_BASE_URL}/programsubmissions/?program=${programId}`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setSubmissions(response.data);
    } catch (err) {
      console.log('Failed to load submissions:', err);
      Alert.alert('Error', 'Failed to load submissions for this program.');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const openModal = (program) => {
    setSelectedProgram(program);
    setModalVisible(true);
    setExpandedSubmissionId(null);
    fetchSubmissions(program.id);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProgram(null);
    setSubmissions([]);
    setExpandedSubmissionId(null);
  };

  const toggleMoreDetails = (submissionId) => {
    setExpandedSubmissionId(prevId =>
      prevId === submissionId ? null : submissionId
    );
  };

  const updateSubmissionStatus = async (submissionId, newStatus) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_BASE_URL}/programsubmissions/${submissionId}/update_status/`,
        { status: newStatus },
        { headers: { Authorization: `Token ${token}` } }
      );

      if (response.status === 200) {
        setSubmissions(prev =>
          prev.map(s =>
            s.id === submissionId ? { ...s, status: newStatus } : s
          )
        );
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to update status.');
    }
  };

  // ---------------- RENDER ----------------
  if (loadingPrograms) {
    return (
      <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'red' }}>{error}</Text>
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
        {/* HEADER */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: '#f0f0f0',
          elevation: 4,
          borderBottomWidth: 1,
          borderBottomColor: '#e6e6e6'
        }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Review Submissions</Text>
        </View>

        {/* PROGRAM LIST */}
        <ScrollView style={{ paddingHorizontal: 20 }} contentContainerStyle={{ paddingVertical: 20 }}>
          {programs.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No programs found.</Text>
          ) : programs.map(program => (
            <TouchableOpacity
              key={program.id}
              style={{
                backgroundColor: '#fff',
                padding: 15,
                borderRadius: 12,
                marginBottom: 15,
                elevation: 3,
                borderWidth: 1,
                borderColor: '#ececec'
              }}
              onPress={() => openModal(program)}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{program.name}</Text>
              <Text style={{ color: '#555' }}>View submissions →</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* SUBMISSIONS MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
              {selectedProgram?.name} Submissions
            </Text>

            {loadingSubmissions ? (
              <ActivityIndicator size="large" />
            ) : submissions.length === 0 ? (
              <Text>No submissions for this program.</Text>
            ) : (
              <ScrollView style={{ maxHeight: 300 }}>
                {submissions.map(item => (
                  <View key={item.id} style={{
                    padding: 12,
                    backgroundColor: '#f7f7f7',
                    borderRadius: 10,
                    marginBottom: 10,
                    borderColor: expandedSubmissionId === item.id ? '#007bff' : '#f7f7f7',
                    borderWidth: 1
                  }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.student_name}</Text>
                    <Text>{item.course_section}</Text>
                    <Text>Status: {item.status.toUpperCase()}</Text>

                    {expandedSubmissionId === item.id && (
                      <View style={{ marginTop: 10, borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 10 }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Emergency Contact Details:</Text>
                        <Text>Name: {item.emergency_contact_name || 'N/A'}</Text>
                        <Text>Phone: {item.emergency_contact_phone || 'N/A'}</Text>
                      </View>
                    )}

                    <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                      {item.status.toUpperCase() === 'PENDING' ? (
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            style={{ backgroundColor: 'green', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 8 }}
                            onPress={() => updateSubmissionStatus(item.id, 'approved')}
                          >
                            <Text style={{ color: 'white' }}>Accept</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ backgroundColor: 'red', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 8, marginLeft: 10 }}
                            onPress={() => updateSubmissionStatus(item.id, 'rejected')}
                          >
                            <Text style={{ color: 'white' }}>Reject</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={{ backgroundColor: '#ccc', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 8 }}>
                          <Text style={{ color: '#555', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {item.status}
                          </Text>
                        </View>
                      )}

                      <TouchableOpacity
                        style={{ backgroundColor: '#007bff', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 8, marginLeft: 10 }}
                        onPress={() => toggleMoreDetails(item.id)}
                      >
                        <Text style={{ color: 'white' }}>{expandedSubmissionId === item.id ? 'Hide Details' : 'More Details'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              onPress={closeModal}
              style={{ marginTop: 15, padding: 10, backgroundColor: '#ccc', borderRadius: 8, alignSelf: 'flex-end' }}
            >
              <Text>Close</Text>
            </TouchableOpacity>
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
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20
  }
});
