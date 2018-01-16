
import React, { Component } from 'react'
import { NavigatorIOS, StatusBar, StyleSheet, TabBarIOS, Text, View } from 'react-native'
import { Network, Types } from 'blockchain-wallet-v4/src'
import { NavigationBar } from './components'
import { Dashboard, Pin, Request, Send, Transactions } from './scenes'
import images from '@assets/images'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  navigator: { flex: 1 }
})

const api = Network.createWalletApi({
  rootUrl: 'https://blockchain.info/',
  apiUrl: 'https://api.blockchain.info/',
  apiCode: '1770d5d9-bcea-4d28-ad21-6cbd5be018a8'
})

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      wallet: null,
      loading: true,
      selectedTab: 0
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

  setSelectedTab(idx) {
    this.setState({ selectedTab: idx })
  }

  render() {
    let { loading, selectedTab, wallet } = this.state
    StatusBar.setBarStyle('light-content', true)
    return (
      (!wallet ? <Pin /> :
      <View style={styles.container}>
        <NavigationBar />
        <TabBarIOS
          barTintColor="#FFF"
          tintColor="#004A7C"
          translucent={false}
          >
          <TabBarIOS.Item
            icon={images.home}
            onPress={() => this.setSelectedTab(0)}
            selected={selectedTab === 0}
            selectedIcon={images.home_selected}
            title="Dashboard">
              <Dashboard />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            icon={require('../assets/img/send.png')}
            onPress={() => this.setSelectedTab(1)}
            selected={selectedTab === 1}
            title="Send">
              <Send />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            icon={require('../assets/img/request.png')}
            onPress={() => this.setSelectedTab(2)}
            selected={selectedTab === 2}
            title="Request">
              <Request />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            icon={images.transactions}
            onPress={() => this.setSelectedTab(3)}
            selected={selectedTab === 3}
            selectedIcon={images.transactions_selected}
            title="Transactions">
              <Transactions />
          </TabBarIOS.Item>
        </TabBarIOS>
      </View>)
    )
  }
}
