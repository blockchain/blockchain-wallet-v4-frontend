import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Network, Types } from 'blockchain-wallet-v4/src'

const api = Network.createWalletApi({
  rootUrl: 'https://blockchain.info/',
  apiUrl: 'https://api.blockchain.info/',
  apiCode: '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
})

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      wallet: null,
      loading: true
    }
  }

  componentWillMount () {
    this.loadWallet()
  }

  loadWallet () {
    let guid = '3d197b76-f8a3-49b7-8862-ec6191707f07'
    let pw = 'password123'
    let sk = '87aec1ef-5c6e-4dff-8b67-890545fa31f8'

    api.fetchWallet(guid, sk, void 0, pw).then((wallet) => {
      this.setState({ wallet, loading: false })
    })
  }

  render () {
    let { wallet, loading } = this.state
    return (
      <View style={styles.container}>
        {loading ? (
          <Text style={styles.welcome}>
            Loading...
          </Text>
        ) : (
          <Text style={styles.welcome}>
            Loaded: {JSON.stringify(Types.Wrapper.toJS(wallet), null, 2)}
          </Text>
        )}
      </View>
    )
  }
}
