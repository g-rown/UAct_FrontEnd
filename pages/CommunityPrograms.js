import React from 'react';
import { View, Text, Button} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles';

export default function CommunityPrograms() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>COMMUNITY PROGRAMS</Text>

            <Button
                title="Program Application"
                onPress={() => navigation.navigate('ProgramApplication')}
            />
        </View>

        
    );
}

