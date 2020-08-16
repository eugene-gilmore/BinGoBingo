import React from 'react';
import {
  StyleSheet,
  View,
  Text as RNText,
  Dimensions,
  Animated
} from 'react-native';
import * as d3Shape from 'd3-shape';
import color from 'randomcolor';
import { snap } from '@popmotion/popcorn';
// const { PanGestureHandler, State } = GestureHandler;
import Svg, { Path, G, Text, TSpan } from 'react-native-svg';
import {Animals} from '../constants'
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('screen');

const makeWheel = (wheelParams) => {
  const data = wheelParams.segWeights//Array.from({ length: wheelParams.numberOfSegments }).fill(1);
  const arcs = d3Shape.pie().value(function(d){
    return d;
}).sort(null)(data)
  const colors = color({
    luminosity: 'dark',
    count: wheelParams.numberOfSegments
  });

  return arcs.map((arc, index) => {
    const instance = d3Shape
      .arc()
      .padAngle(0.01)
      .outerRadius(width / 2)
      .innerRadius(20);

    return {
      path: instance(arc),
      color: colors[index],
      value: wheelParams.values[index],//Math.round(Math.random() * 10 + 1) * 200, //[200, 2200]
      centroid: instance.centroid(arc)
    };
  });
};

class AnimalScreen extends React.Component {
  _wheelPaths = []//makeWheel();
  _wheelParams = {}
  _angle = new Animated.Value(250);
  angle = 250;

  state = {
    enabled: true,
    finished: false,
    winner: null
  };

  componentDidMount() {
    this._angle.addListener(event => {
      if (this.state.enabled) {
        // this.setState({
        //   enabled: false,
        //   finished: false
        // });
      }

      this.angle = event.value;
    });

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
        this._onPan()
        // setTimeout(() => {
        //     const winnerIndex = this._getWinnerIndex();
        //     console.log(winnerIndex)
        //   this.setState({
        //     enabled: true,
        //     finished: true,
        //     winner: this._wheelPaths[winnerIndex].value
        //   });
        // }, 2000)
    });
  }

  _getWinnerIndex = () => {
    const deg = Math.abs(Math.round(this.angle % this._wheelParams.oneTurn));
    let sumAngle = this._wheelParams.segWeights[0]*180
    for(let i = 0; i<this._wheelParams.segWeights.length; ++i) {
        if(deg < sumAngle) {
            return (4 - i) % this._wheelParams.segWeights.length
        }
        sumAngle = sumAngle + this._wheelParams.segWeights[i]*this._wheelParams.oneTurn
    }
    return 0
  };

  _onPan = () => {
      const velocityY = 6000 + Math.random() * 2000;

      Animated.decay(this._angle, {
        velocity: velocityY / 1000,
        deceleration: 0.996,
        useNativeDriver: true
      }).start(() => {
        this._angle.setValue(this.angle % this._wheelParams.oneTurn);
        const winnerIndex = this._getWinnerIndex();
          this.setState({
            enabled: true,
            finished: true,
            winner: this._wheelPaths[winnerIndex].value
          });
        // do something here;
      });
  };
  render() {
    if(this._wheelParams.numberOfSegments === undefined) {
    const {trash} = this.props.route.params
    let values = []
    let segWeights = []
    for(var i = 0; i<trash.probabilities.length; ++i) {
        if(trash.probabilities[i] !== 0) {
            values.push(Animals[i])
            segWeights.push(trash.probabilities[i])
        }
    }
    const numberOfSegments = values.length;
    const wheelSize = width * 0.95;
    const fontSize = 16;
    const oneTurn = 360;
    const angleBySegment = oneTurn / numberOfSegments;
    const angleOffset = angleBySegment / 2;
    const knobFill = color({ hue: 'purple' });
    this._wheelParams = {
        numberOfSegments: numberOfSegments,
        values: values,
        segWeights: segWeights,
        wheelSize: wheelSize,
        fontSize: fontSize,
        oneTurn: oneTurn,
        angleBySegment: angleBySegment,
        angleOffset: angleOffset,
        knobFill: knobFill,
    }
    this._wheelPaths = makeWheel(this._wheelParams)
    }
    return (
    //   <PanGestureHandler
    //     onHandlerStateChange={this._onPan}
    //     enabled={this.state.enabled}
    //   >
        <View style={styles.container}>
          {this._renderSvgWheel()}
          {this.state.finished && this.state.enabled && this._renderWinner()}
        </View>
    //   </PanGestureHandler>
    );
  }

  _renderKnob = () => {
    const knobSize = 30;
    // [0, numberOfSegments]
    const YOLO = Animated.modulo(
      Animated.divide(
        Animated.modulo(Animated.subtract(this._angle, this._wheelParams.angleOffset), this._wheelParams.oneTurn),
        new Animated.Value(this._wheelParams.angleBySegment)
      ),
      1
    );

    return (
      <Animated.View
        style={{
          width: knobSize,
          height: knobSize * 2,
          justifyContent: 'flex-end',
          zIndex: 1,
          transform: [
            {
              rotate: YOLO.interpolate({
                inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg']
              })
            }
          ]
        }}
      >
        <Svg
          width={knobSize}
          height={(knobSize * 100) / 57}
          viewBox={`0 0 57 100`}
          style={{ transform: [{ translateY: 8 }] }}
        >
          <Path
            d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
            fill={this._wheelParams.knobFill}
          />
        </Svg>
      </Animated.View>
    );
  };

  _renderWinner = () => {
    return (
      <RNText style={styles.winnerText}>{this.state.winner}!</RNText>
    );
  };

  _renderSvgWheel = () => {
    return (
      <View style={styles.container}>
        {this._renderKnob()}
        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              {
                rotate: this._angle.interpolate({
                  inputRange: [-this._wheelParams.oneTurn, 0, this._wheelParams.oneTurn],
                  outputRange: [`-${this._wheelParams.oneTurn}deg`, `0deg`, `${this._wheelParams.oneTurn}deg`]
                })
              }
            ]
          }}
        >
          <Svg
            width={this._wheelParams.wheelSize}
            height={this._wheelParams.wheelSize}
            viewBox={`0 0 ${width} ${width}`}
            style={{ transform: [{ rotate: `-${this._wheelParams.angleOffset}deg` }] }}
          >
            <G y={width / 2} x={width / 2}>
              {this._wheelPaths.map((arc, i) => {
                const [x, y] = arc.centroid;
                const number = arc.value.toString();

                return (
                  <G key={`arc-${i}`}>
                    <Path d={arc.path} fill={arc.color} />
                    <G
                      rotation={this._wheelParams.angleOffset + 0}
                      origin={`${x}, ${y}`}
                    >
                      <Text
                        x={x}
                        y={y - 70}
                        fill="white"
                        textAnchor="middle"
                        fontSize={this._wheelParams.fontSize}
                      >
                        {Array.from({ length: number.length }).map((_, j) => {
                          return (
                            <TSpan
                              x={x}
                              dy={this._wheelParams.fontSize}
                              key={`arc-${i}-slice-${j}`}
                            >
                              {number.charAt(j)}
                            </TSpan>
                          );
                        })}
                      </Text>
                    </G>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  winnerText: {
    fontSize: 32,
    fontFamily: 'Menlo',
    position: 'absolute',
    bottom: 10
  }
});

export default function(props) {
    const navigation = useNavigation();
  
    return <AnimalScreen {...props} navigation={navigation} />;
}