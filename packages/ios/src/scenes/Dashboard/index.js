

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
// import { Icon } from 'blockchain-info-components/src'

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})

export default class Dashboard extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {

  }

  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.welcome}>Dashboard</Text>
      </View>
    )
  }
}
