
import React, { Component } from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import images from '@assets/images'

const styles = StyleSheet.create({
  barButton: {
    tintColor: "#FFF"
  },
  container: {
    alignItems: "center",
    backgroundColor: "#004A7C",
    flexDirection: "row",
    height: 150,
    justifyContent: "space-between",
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {
    fontSize: 30,
    fontFamily: "Montserrat-Light",
    fontWeight: "300",
    color: "#FFF",
    textAlign: "center"
  }
})

export default class NavigationBar extends Component {

  revealMenu() {}

  scanQRCode() {}

  render() {
    return(
      <View style={styles.container}>
        <BarButtonItem icon={images.menu} onPress={this.revealMenu} />
        <Text style={styles.title}>$0.00</Text>
        <TouchableHighlight onPress={this.scanQRCode}>
          <BarButtonItem icon={images.QRCode} onPress={this.scanQRCode} />
        </TouchableHighlight>
      </View>
    )
  }
}

class BarButtonItem extends Component {
  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps)
  }

  render() {
    const { icon, onPress } = this.props
    return(
      <TouchableHighlight onPress={onPress}>
        <Image source={icon} style={styles.barButton} />
      </TouchableHighlight>
    )
  }
}
