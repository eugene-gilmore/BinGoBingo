import React from 'react'
import { Button, View, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

export default HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('Capture',)
                }
                style={styles.button}
            >
                  <Icon name="camera" size={70} color="black" />
                <Text style={styles.text}>Capture Trash</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('Board')
                }
                style={styles.button}>
                    <Text style={styles.text}>Bingo Board</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = {
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        padding: 10,
        margin: 5,
        flex: 1,
        borderRadius: 20
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'black'
    },
    text: {
        fontSize: 30
    }
}