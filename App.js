import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image, Alert, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

import styles from './styles';

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

import AdminDashboard from './pages/AdminDashboard'
import ManageStudents from './pages/ManageStudents'
import ManagePrograms from './pages/ManagePrograms'
import AddProgram from './pages/AddProgram'
import EditProgram from './pages/EditProgram'
import ReviewSubmissions from './pages/ReviewSubmissions'
import ServiceAccreditation from './pages/ServiceAccreditation'

import StudentDashboard from './pages/StudentDashboard'
import CommunityPrograms from './pages/CommunityPrograms'
import ProgramApplication from './pages/ProgramApplication'
import ServiceHistory from './pages/ServiceHistory'
import EditStudent from './pages/EditStudent'

const Stack = createNativeStackNavigator(); 
const Tab = createBottomTabNavigator();


const LoadingScreen = () => (
    <View style={styles.container}>
        <ActivityIndicator size="large" color="#021c2eff" />
        <Text style={styles.text}>Loading user session...</Text>
    </View>
);

function StudentTabs() {

    const HomeIconActive = require('./assets/icons/dashboardactive.png');
    const HomeIconInactive = require('./assets/icons/dashboardinactive.png');
    const ProgramsIconActive = require('./assets/icons/programactive.png');
    const ProgramsIconInactive = require('./assets/icons/programinactive.png');
    const HistoryIconActive = require('./assets/icons/historyactive.png');
    const HistoryIconInactive = require('./assets/icons/historyinactive.png');
    
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let imageSource;
                    const iconSize = 30;

                    if (route.name === 'Dashboard') {
                        imageSource = focused ? HomeIconActive : HomeIconInactive;
                    } else if (route.name === 'Programs') {
                        imageSource = focused ? ProgramsIconActive : ProgramsIconInactive;
                    } else if (route.name === 'History') {
                        imageSource = focused ? HistoryIconActive : HistoryIconInactive;
                    } 
                    return (
                        <Image 
                            source={imageSource} 
                            style={{ 
                                    width: iconSize, 
                                    height: iconSize,
                                    tintColor: color,
                                }} 
                            />
                        );
                },

                tabBarStyle: {
                    height: 67,       
                    paddingVertical: 0, 
                    backgroundColor: '#f8f8f8', 
                },

                tabBarItemStyle: {
                    justifyContent: 'center', 
                    alignItems: 'center',
                    paddingTop: 8,
                },
                            
                tabBarLabelStyle: {
                    fontSize: 12,      
                    textAlign: 'center',
                    paddingTop: 2,
                },

                tabBarActiveTintColor: '#021c2eff', // Active icon color
                tabBarInactiveTintColor: 'gray', // Inactive icon color
                headerShown: false
            })}
        >
            <Tab.Screen 
                name="Dashboard" 
                component={StudentDashboard} 
                options={{ 
                    title: 'Dashboard',
                    headerShown: false
                 }}
            />
            <Tab.Screen 
                name="Programs" 
                component={CommunityPrograms} 
                options={{ title: 'Programs' }}
            />
            <Tab.Screen 
                name="History" 
                component={ServiceHistory} 
                options={{ title: 'History' }}
            />
            
        </Tab.Navigator>
    );
}

function AdminTabs() {

    const HomeIconActive = require('./assets/icons/dashboardactive.png');
    const HomeIconInactive = require('./assets/icons/dashboardinactive.png');
    const ManageStudentsIconActive = require('./assets/icons/managestudentsactive.png');
    const ManageStudentsIconInactive = require('./assets/icons/managestudentsinactive.png');
    const ManageProgramsIconActive = require('./assets/icons/manageprogramsactive.png');
    const ManageProgramsIconInactive = require('./assets/icons/manageprogramsinactive.png');
    const ReviewSubmissionsIconActive = require('./assets/icons/reviewsubmissionsactive.png');
    const ReviewSubmissionsIconInactive = require('./assets/icons/reviewsubmissionsinactive.png');
    const ServiceAccreditationIconActive = require('./assets/icons/servicecreditactive.png');
    const ServiceAccreditationIconInactive = require('./assets/icons/servicecreditinactive.png');

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let imageSource;
                    const iconSize = 30;
                    
                    if (route.name === 'ADashboard') {
                        imageSource = focused ? HomeIconActive : HomeIconInactive;
                    } else if (route.name === 'ManageStudents') {
                        imageSource = focused ? ManageStudentsIconActive : ManageStudentsIconInactive;
                    } else if (route.name === 'ManagePrograms') {
                        imageSource = focused ? ManageProgramsIconActive : ManageProgramsIconInactive;
                    } else if (route.name === 'ReviewSubmissions') {
                        imageSource = focused ? ReviewSubmissionsIconActive : ReviewSubmissionsIconInactive;
                    } else if (route.name === 'ServiceAccreditation') {
                        imageSource = focused ? ServiceAccreditationIconActive : ServiceAccreditationIconInactive;
                    } 
                    return (
                        <Image 
                            source={imageSource} 
                            style={{ 
                                    width: iconSize, 
                                    height: iconSize,
                                    tintColor: color,
                                }} 
                            />
                        );
                },

                tabBarStyle: {
                    height: 67,       
                    paddingVertical: 0, 
                    backgroundColor: '#f8f8f8', 
                },

                tabBarItemStyle: {
                    justifyContent: 'center', 
                    alignItems: 'center',
                    paddingTop: 0,
                    flex: 1,
                    paddingTop: 15,
                    paddingBottom: 0
                },

                tabBarShowLabel: false,
                tabBarActiveTintColor: '#021c2eff', // Active icon color
                tabBarInactiveTintColor: 'gray', // Inactive icon color
                headerShown: false
            })}
        >   
            <Tab.Screen 
                name="ADashboard" 
                component={AdminDashboard} 
                options={{ headerShown: false }}
            />
            <Tab.Screen 
                name="ManageStudents" 
                component={ManageStudents} 
                options={{ headerShown: false }}
            />
            <Tab.Screen 
                name="ManagePrograms" 
                component={ManagePrograms} 
                ooptions={{ headerShown: false }}
            />
            <Tab.Screen 
                name="ReviewSubmissions" 
                component={ReviewSubmissions} 
                options={{ headerShown: false }}
            />
            <Tab.Screen 
                name="ServiceAccreditation" 
                component={ServiceAccreditation} 
                options={{ headerShown: false }}
            />
            
        </Tab.Navigator>
    );
}

const LogoutIcon = require('./assets/icons/logout.png');

const LogoutButton = ({ navigation }) => {
    
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            
            navigation.replace('Login'); 
            
        } catch (error) {
            console.error("Logout Error:", error);
            Alert.alert("Logout Failed", "Could not clear token.");
        }
    };

    return (
        <TouchableOpacity 
            onPress={handleLogout} 
            style={{ marginRight: 15 }}
        >
            <Image 
                source={LogoutIcon} 
                style={{ 
                    width: 24,
                    height: 24,
                }}
            />
        </TouchableOpacity>
    );
};

const LogoImage = require('./assets/logo.png');
const LOGO_STYLE = {
    width: 120,
    height: 35, 
};

export default function App() {

    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState(null); // 'admin', 'student', or null

    useEffect(() => {
        const checkUserStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const isAdmin = await AsyncStorage.getItem('isAdmin');
                const isStudent = await AsyncStorage.getItem('isStudent');

                if (token) {
                    // Token exists, determine role
                    if (isAdmin === 'true') {
                        setUserRole('admin');
                    } else if (isStudent === 'true') {
                        setUserRole('student');
                    }
                }
            } catch (e) {
                console.error("Failed to load token:", e);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserStatus();
    }, []);

    if (isLoading) {
        // Render a simple loading screen while checking storage
        return <LoadingScreen />; 
    }

    const initialRoute = 
        userRole === 'admin' ? 'AdminDashboard' :
        userRole === 'student' ? 'StudentDashboard' :
        'Login';

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={initialRoute}>
                    <Stack.Screen 
                        name="Login" 
                        component={LoginPage} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="Signup" 
                        component={SignupPage} 
                        options={{ headerShown: false }} 
                    />

                    <Stack.Screen 
                        name="AdminDashboard" 
                        component={AdminTabs} 
                        options={({ navigation }) => ({
                            headerShown: true,
                            headerTitle: () => (
                                <Image
                                    source={LogoImage}
                                    style={LOGO_STYLE}
                                />
                            ),
                            headerTitleStyle: {
                                color: '#021c2eff',
                                fontWeight: 'bold',
                                fontSize: 22,
                                marginLeft: 10,
                            },
                            headerLeft: () => null,

                            headerBackVisible: false,
                            headerRight: () => (
                                <LogoutButton navigation={navigation} />
                            ),
                            headerStyle: {
                                backgroundColor: '#FFFFFF',
                                elevation: 1,
                                shadowOpacity: 0.1,
                            },
                        })} 
                    />

                    <Stack.Screen name="AddProgram" component={AddProgram} />
                    <Stack.Screen name="EditProgram" component={EditProgram} />

                    <Stack.Screen 
                        name="StudentDashboard" 
                        component={StudentTabs} 
                        options={({ navigation }) => ({
                            headerShown: true,
                            headerTitle: () => (
                                <Image
                                    source={LogoImage}
                                    style={LOGO_STYLE}
                                />
                            ),
                            headerTitleStyle: {
                                color: '#021c2eff',
                                fontWeight: 'bold',
                                fontSize: 22,
                                marginLeft: 10,
                            },
                            headerLeft: () => null,

                            headerBackVisible: false,
                            headerRight: () => (
                                <LogoutButton navigation={navigation} />
                            ),
                            headerStyle: {
                                backgroundColor: '#FFFFFF',
                                elevation: 1,
                                shadowOpacity: 0.1,
                            },
                        })} 
                    />

                    <Stack.Screen name="ProgramApplication" component={ProgramApplication} />
                    <Stack.Screen name="EditStudent" component={EditStudent} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}