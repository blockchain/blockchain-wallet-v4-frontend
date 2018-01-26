
import React, { Component } from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

const styles = StyleSheet.create({
  base: {}
})

export default class BarButtonItem extends Component {

  setNativeProps = (nativeProps) => {
    this._root.setNativeProps(nativeProps)
  }

  render() {
    const { icon, onPress, tintColor } = this.props
    return (
      <TouchableHighlight onPress={onPress}>
        <Image source={icon} style={{tintColor: tintColor}} />
      </TouchableHighlight>
    )
  }
}
