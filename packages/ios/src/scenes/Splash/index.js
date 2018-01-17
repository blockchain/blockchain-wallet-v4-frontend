
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Image, StyleSheet, Text, View } from 'react-native'
import images from '@assets/images'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    marginTop: 35,
  }
})

export default class Splash extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {}

  render() {
    return (
      <View style={styles.container}>
        <Image source={images.bc_logo} />
        <Image source={images.blockchain_blue} style={styles.logo} />
      </View>
    )
  }
}
