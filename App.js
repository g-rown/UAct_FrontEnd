import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

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



const Stack = createNativeStackNavigator(); 

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginPage} />
                <Stack.Screen name="Signup" component={SignupPage} /> 

                <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
                <Stack.Screen name="ManageStudents" component={ManageStudents} />
                <Stack.Screen name="ManagePrograms" component={ManagePrograms} />
                <Stack.Screen name="AddProgram" component={AddProgram} />
                <Stack.Screen name="EditProgram" component={EditProgram} />
                <Stack.Screen name="ReviewSubmissions" component={ReviewSubmissions} />

                <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
                <Stack.Screen name="ServiceHistory" component={ServiceHistory} />
                <Stack.Screen name="CommunityPrograms" component={CommunityPrograms} />
                <Stack.Screen name="ProgramApplication" component={ProgramApplication} />
                <Stack.Screen name="ServiceAccreditation" component={ServiceAccreditation} />

            </Stack.Navigator> 
        </NavigationContainer>
    )
}