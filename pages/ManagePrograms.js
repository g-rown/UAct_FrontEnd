import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from '../styles';

// --- START OF STYLES MODIFICATION ---
// COLOR PALETTE (UA LOGO)
const COLOR_BLUE = '#001e66';
const COLOR_RED = '#cf1a24';
const COLOR_YELLOW = '#ffd800';
const COLOR_LIGHT_GRAY = '#f4f4f4';
const COLOR_MEDIUM_GRAY = '#e0e0e0';

const API_BASE_URL = 'https://uact-backend.onrender.com/api';

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

    // --- START OF NEW LOGIC FOR HANDLING EDITED PROGRAMS ---
    if (route.params?.updatedProgram) {
        const updatedProgram = route.params.updatedProgram;
        
        // Find the program by ID and replace it with the updated data
        setPrograms(prev => prev.map(p => 
            p.id === updatedProgram.id ? updatedProgram : p
        ));
        
        // Clear the param to prevent the update from re-running on focus/re-render
        navigation.setParams({ updatedProgram: undefined });
    }
    // --- END OF NEW LOGIC ---
    
  }, [route.params?.newProgram, route.params?.updatedProgram]);

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
        <ActivityIndicator size="large" color={COLOR_BLUE} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: COLOR_RED, marginBottom: 15, fontSize: 16, textAlign: 'center' }}>
          Error: {error}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ padding: 10, borderWidth: 1, borderColor: COLOR_BLUE, borderRadius: 8 }}>
          <Text style={{ color: COLOR_BLUE, fontWeight: 'bold' }}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { flex: 1, backgroundColor: COLOR_LIGHT_GRAY }]}>
      <View style={componentStyles.mainCardContainer}>
        {/* HEADER */}
        <View style={componentStyles.header}>
          <Text style={componentStyles.headerTitle}>Community Programs</Text>
          <TouchableOpacity 
            style={componentStyles.addButton}
            onPress={() => navigation.navigate('AddProgram')}
          >
            <Text style={componentStyles.addButtonText}>Add New +</Text>
          </TouchableOpacity>
        </View>

        {/* PROGRAM CARDS */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={componentStyles.scrollViewContent}>
          {programs.length === 0 ? (
            <Text style={componentStyles.noProgramsText}>
              No programs found. Click 'Add New +' to create one.
            </Text>
          ) : programs.map(program => (
            <View key={program.id} style={componentStyles.programCard}>
              <Text style={componentStyles.programName}>{program.name}</Text>
                
              <View style={componentStyles.programDetails}>
                <Text style={componentStyles.detailText}><Text style={componentStyles.detailLabel}>Description:</Text> {program.description}</Text>
                <Text style={componentStyles.detailText}><Text style={componentStyles.detailLabel}>Location:</Text> {program.location}</Text>
                <Text style={componentStyles.detailText}><Text style={componentStyles.detailLabel}>Facilitator:</Text> {program.facilitator}</Text>
                <Text style={componentStyles.detailText}><Text style={componentStyles.detailLabel}>Date:</Text> {program.date}</Text>
                <Text style={componentStyles.detailText}><Text style={componentStyles.detailLabel}>Time:</Text> {program.time_start} - {program.time_end}</Text>
                <Text style={componentStyles.detailText}><Text style={componentStyles.detailLabel}>Hours:</Text> {program.hours}</Text>
                <Text style={componentStyles.detailText}><Text style={componentStyles.detailLabel}>Slots:</Text> {program.slots}</Text>
                <Text style={componentStyles.detailText}><Text style={componentStyles.detailLabel}>Taken:</Text> {program.slots_taken}</Text>
                <Text style={componentStyles.detailText}><Text style={componentStyles.detailLabel}>Remaining:</Text> {program.slots_remaining ?? (program.slots - program.slots_taken)}</Text>
              </View>

              {/* Buttons */}
              <View style={componentStyles.buttonRow}>
                <TouchableOpacity
                  style={componentStyles.editButton}
                  onPress={() => navigation.navigate('EditProgram', { program })}
                >
                  <Text style={componentStyles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={componentStyles.deleteButton}
                  onPress={() => openDeletePopup(program.id)}
                >
                  <Text style={componentStyles.deleteButtonText}>Delete</Text>
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
        <View style={componentStyles.modalOverlay}>
          <View style={componentStyles.modalContainer}>
            <Text style={componentStyles.modalTitle}>Confirm Delete</Text>
            <Text style={componentStyles.modalMessage}>Are you sure you want to delete this program? This action cannot be undone.</Text>

            <View style={componentStyles.modalButtonRow}>
              <TouchableOpacity
                style={componentStyles.modalCancelButton}
                onPress={closeDeletePopup}
              >
                <Text style={componentStyles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={componentStyles.modalConfirmButton}
                onPress={() => deleteProgram(selectedProgramId)}
              >
                <Text style={componentStyles.modalConfirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const componentStyles = StyleSheet.create({
  mainCardContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1000, // Added max-width for better look on larger screens
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    marginVertical: 20,
    alignSelf: 'center', // Center the card
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLOR_BLUE, // Blue shade
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: COLOR_YELLOW, // Yellow shade
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
  },
  addButtonText: {
    fontSize: 16,
    color: COLOR_BLUE,
    fontWeight: 'bold',
  },
  scrollViewContent: { 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  programCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: COLOR_MEDIUM_GRAY,
    borderLeftWidth: 5,
    borderLeftColor: COLOR_YELLOW, // Yellow accent stripe
  },
  programName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLOR_BLUE,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_LIGHT_GRAY,
    paddingBottom: 5,
  },
  programDetails: {
    marginLeft: 0, 
    marginBottom: 5 
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: COLOR_BLUE
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLOR_MEDIUM_GRAY,
    paddingTop: 10,
  },
  editButton: {
    backgroundColor: COLOR_BLUE,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: COLOR_RED,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noProgramsText: {
    textAlign: 'center', 
    marginTop: 40, 
    color: '#666', 
    fontSize: 16
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%', // Increased width for better text flow on mobile/tablet
    maxWidth: 400, // Max width for larger screens
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    elevation: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLOR_BLUE,
  },
  modalMessage: {
    marginBottom: 25,
    fontSize: 15,
    color: '#333'
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_MEDIUM_GRAY,
    backgroundColor: COLOR_LIGHT_GRAY,
  },
  modalCancelButtonText: {
    color: '#333',
    fontWeight: 'bold'
  },
  modalConfirmButton: {
    backgroundColor: COLOR_RED,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10
  },
  modalConfirmButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

// The `modalStyles` was renamed and integrated into `componentStyles` 
// to be consistent with the component's styling structure. The original 
// `modalStyles` declaration in the user's code is removed and replaced.

// --- END OF STYLES MODIFICATION ---

// The `modalStyles` variable from the original code is no longer needed
// as its contents are now in `componentStyles`.
// The original code uses a variable called `styles` which is assumed 
// to be imported from `../styles`, and thus remains untouched where
// it's used for the main container styles in the component functions.