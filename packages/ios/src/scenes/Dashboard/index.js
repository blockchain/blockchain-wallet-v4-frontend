// -- DASHBOARD SCENE -- //
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, StyleSheet, Text, View } from 'react-native'
import { actions, selectors } from '../../data'

let guid = ''
let pw = ''
let code = null
let sk = ''

class Dashboard extends Component {
  render() {
    const { actions, wallet } = this.props
    console.log("Wallet payload: ", wallet)
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Dashboard</Text>
        <Text style={styles.welcome}>{wallet}</Text>
        <Button
          onPress={() => actions.login(guid, pw, code, sk)}
          title="Login"
        />
      </View>
    )
  }
}

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
  },
})

const mapStateToProps = state => ({
  wallet: selectors.auth.wallet(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.auth, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
