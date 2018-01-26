
import React, { Component } from 'react'
import { AppRegistry, Dimensions, StyleSheet, Text, View } from 'react-native';
import Camera from 'react-native-camera'

export default class Scan extends Component {

  getInitialState() {
    return {
      scanning: true,
      cameraType: Camera.constants.Type.back,
    }
  }

  _handleBarCodeRead() {
    this.setState({ scanning: false })
  }

  render() {
    const { cameraType, scanning } = this.state
    if (scanning) {
      return (
        <View style={styles.container}>
          <Camera onBarCodeRead={() => this._handleBarCodeRead()} type={cameraType}/>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  }
})
