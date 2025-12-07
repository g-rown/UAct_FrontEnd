import React from 'react';
import { View, Text, Button, ImageBackground} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles';

export default function StudentDashboard() {
    const navigation = useNavigation();

    return (
        <ImageBackground
            source={require('../assets/redox-01.png')}
            style={styles.bg}
        >
            <View style={styles.container}>
                <Text>Welcome, Student!</Text>

                <Button
                    title="View Available Programs"
                    onPress={() => navigation.navigate('CommunityPrograms')}
                />

                <Button
                    title="Review Service History"
                    onPress={() => navigation.navigate('ServiceHistory')}
                />
            </View>
        </ImageBackground>
        
    );
}


