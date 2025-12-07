import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function ManagePrograms() {
  const navigation = useNavigation();
  const route = useRoute();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For in-app delete popup
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(null);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError("You must be logged in to view programs.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/programs/`, {
        headers: { Authorization: `Token ${token}` },
      });

      setPrograms(response.data);
    } catch (err) {
      console.error("Error fetching programs:", err.response?.data || err.message);
      let msg = "Failed to load programs.";
      if (err.response?.status === 401) msg = "Unauthorized. Please log in again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (route.params?.newProgram) {
      setPrograms(prev => [route.params.newProgram, ...prev]);
      navigation.setParams({ newProgram: undefined });
    }
  }, [route.params?.newProgram]);

  const deleteProgram = async (id) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.delete(`${API_BASE_URL}/programs/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      });

      if (response.status === 204 || response.status === 200) {
        setPrograms(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err.response ? err.response.data : err.message);
    } finally {
      setModalVisible(false);
      setSelectedProgramId(null);
    }
  };

  const openDeletePopup = (id) => {
    setSelectedProgramId(id);
    setModalVisible(true);
  };

  const closeDeletePopup = () => {
    setSelectedProgramId(null);
    setModalVisible(false);
  };

  // ------------------- RENDER -------------------
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
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
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
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Programs</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddProgram')}>
            <Text style={{ fontSize: 20, color: '#007bff' }}>Add +</Text>
          </TouchableOpacity>
        </View>

        {/* PROGRAM CARDS */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingVertical: 20 }}>
          {programs.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
              No programs found. Click 'Add +' to create one.
            </Text>
          ) : programs.map(program => (
            <View key={program.id} style={{
              backgroundColor: '#fff',
              padding: 15,
              borderRadius: 12,
              marginBottom: 15,
              elevation: 3,
              borderWidth: 1,
              borderColor: '#ececec'
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{program.name}</Text>

              <View style={{ marginLeft: 5, marginBottom: 10 }}>
                <Text>Description: {program.description}</Text>
                <Text>Location: {program.location}</Text>
                <Text>Facilitator: {program.facilitator}</Text>
                <Text>Date: {program.date}</Text>
                <Text>Time: {program.time_start} - {program.time_end}</Text>
                <Text>Hours: {program.hours}</Text>
                <Text>Slots: {program.slots}</Text>
                <Text>Taken: {program.slots_taken}</Text>
                <Text>Remaining: {program.slots_remaining ?? (program.slots - program.slots_taken)}</Text>
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
                  onPress={() => navigation.navigate('EditProgram', { program })}
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
                  onPress={() => openDeletePopup(program.id)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ------------------- DELETE MODAL ------------------- */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDeletePopup}
      >
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Delete Program</Text>
            <Text style={{ marginBottom: 20 }}>Are you sure you want to delete this program?</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={[modalStyles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={closeDeletePopup}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.modalButton, { backgroundColor: 'red', marginLeft: 10 }]}
                onPress={() => deleteProgram(selectedProgramId)}
              >
                <Text style={{ color: '#fff' }}>Delete</Text>
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
    width: '40%', // <-- smaller width
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