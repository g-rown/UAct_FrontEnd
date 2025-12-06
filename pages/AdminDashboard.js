import React from 'react';
import { View, Text, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles';

export default function AdminDashboard() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>Welcome, ADMIN!</Text>

            <Button
                title="Manage Students"
                onPress={() => navigation.navigate('ManageStudents')}
            />
            
            <Button
                title="Manage Programs"
                onPress={() => navigation.navigate('ManagePrograms')}
            />
            
            <Button
                title="Review Submissions"
                onPress={() => navigation.navigate('ReviewSubmissions')}
            />

            <Button
                title="Service Accreditation"
                onPress={() => navigation.navigate('ServiceAccreditation')}
            />
        </View>

        
    );
}

