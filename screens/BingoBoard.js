import React from 'react'
import { Animals } from '../constants'
import { Text, View } from 'react-native'

export default BingoBoardScreen = ({ route, navigation }) => {
    let board = Array(5)
    for (var i = 0; i < 5; ++i) {
        board[i] = Array(5);
        for (var j = 0; j < 5; ++j) {
            board[i][j] = {
                animal: Animals[Math.floor(Math.random()*Animals.length)],
                found: Math.random() > 0.75
            }
        }
    }
    return (
        <View style={styles.bingoContainer}>
        {board.map(row => 
            <View style={styles.row}>
                {row.map(cell => 
                    <View style={styles.cell}>
                        <Text style={cell.found ? styles.cellTextDone : styles.cellText}>{cell.animal}</Text>
                    </View>    
                )}
            </View>
        )}
        </View>
    );
};

const styles = {
    cell: {
        borderWidth: 1,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
    cellText: {
        fontSize: 18
    },
    cellTextDone: {
        fontSize: 18,
        textDecorationLine: 'line-through'
    },
    bingoContainer: {
        flex: 10
    },
    row: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        borderWidth: 1,
        flex: 1
    },
}