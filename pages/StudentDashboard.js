import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles';

export default function StudentDashboard() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>Welcome, STUDENT!</Text>
        
            <Button
                title="Community Programs"
                onPress={() => navigation.navigate('CommunityPrograms')}
            />

            <Button
                title="Service History"
                onPress={() => navigation.navigate('ServiceHistory')}
            />

        </View>
    );
}
