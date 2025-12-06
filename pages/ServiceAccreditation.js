import React from 'react';
import { View, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styles from '../styles';

export default function ServiceAccreditation() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text>SERVICE ACCREDITATION</Text>
        </View>
    );
}

