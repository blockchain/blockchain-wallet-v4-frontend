
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { NavigatorIOS, SegmentedControlIOS, StyleSheet, Text, View } from 'react-native'
// import { Icon } from 'blockchain-info-components/src'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20
  }
})

export default class Send extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0
    }
  }

  componentWillMount() {}

  render() {
    const { selectedIndex } = this.state
    return (
      <View style={styles.container}>
        <SegmentedControlIOS
          selectedIndex={selectedIndex}
          tintColor='#004A7C'
          values={['Bitcoin', 'Ethereum']} />
          
      </View>
    )
  }
}
