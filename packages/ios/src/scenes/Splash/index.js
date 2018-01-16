
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, StyleSheet, View } from 'react-native'
import images from '@assets/images'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20
  }
})

export default class Splash extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>It works</View>
    )
  }
}
