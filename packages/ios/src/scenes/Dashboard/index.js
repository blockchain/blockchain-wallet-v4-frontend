// -- DASHBOARD SCENE -- //
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Config from 'react-native-config'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, StyleSheet, Text, View } from 'react-native'
import { actions, selectors } from '../../data'
import { CoinDisplay } from '../../components'

let guid = Config.GUID
let pw = Config.PASSWORD
let code = null
let sk = Config.SHARED_KEY

class Dashboard extends Component {
  render() {
    const { actions, bitcoinBalance, transactions, wallet } = this.props
    console.log("Wallet payload: ", wallet)
    console.log("Transactions: ", transactions)
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Dashboard</Text>
        <CoinDisplay value={bitcoinBalance} />
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
  bitcoinBalance: selectors.core.data.bitcoin.getBalance(state),
  transactions: selectors.core.common.bitcoin.getWalletTransactions(state),
  wallet: selectors.auth.wallet(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.auth, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
