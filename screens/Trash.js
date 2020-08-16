import React from 'react'
import {Button} from 'react-native'
import {TrashTypePlasticBag} from '../constants'

export default TrashScreen = ({ navigation }) => {
    return (
        <Button
            title="Plastic Bag"
            onPress={() =>
                navigation.navigate('Animal', {trash : TrashTypePlasticBag})
            }
        />
    );
};