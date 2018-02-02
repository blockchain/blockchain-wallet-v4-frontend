import React, { Component } from 'react'
import { compose, createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { rootReducer, rootSaga } from './data'
import { AppState, NativeModules, NavigatorIOS, StatusBar, StyleSheet, TabBarIOS, Text, View } from 'react-native'
import { BarButtonItem, NavigationBar } from './components'
import { Dashboard, Pin, Request, Scan, Send, Splash, Transactions } from './scenes'
import images from '@assets/images'

const sagaMiddleWare = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
let store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleWare))
)

sagaMiddleWare.run(rootSaga)

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeScene: null, // the currently active scene
      appState: AppState.currentState, // active, inactive or background
      loading: true, // is the wallet loading?
      selectedTab: 0, // currently selected tab in the tab bar
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillMount() {
    StatusBar.setBarStyle('light-content', true)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState })
  }

  // Tab Bar item events

  setSelectedTab(idx) {
    this.setState({ selectedTab: idx })
  }

  // Navigation Bar item events

  revealMenu() {}

  scanQRCode() {
    console.log("Scanning qr code");
  }

  render() {
    const { appState, loading, selectedTab } = this.state
    if (appState === 'inactive') {
      return <Splash />
    }
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <NavigationBar
            leftItem={<BarButtonItem icon={images.menu} onPress={() => this.revealMenu()} tintColor="#FFF" />}
            rightItem={<BarButtonItem icon={images.QRCode} onPress={() => this.scanQRCode()} tintColor="#FFF" />}
            title={<Text style={styles.navigationBarTitle}>$0.00</Text>}
          />
          <TabBarIOS
            barTintColor="#FFF"
            tintColor="#004A7C"
            translucent={false}>
            <TabBarIOS.Item
              icon={images.home}
              onPress={() => this.setSelectedTab(0)}
              selected={selectedTab === 0}
              selectedIcon={images.home_selected}
              title="Dashboard">
                <Dashboard />
            </TabBarIOS.Item>
            <TabBarIOS.Item
              icon={images.send}
              onPress={() => this.setSelectedTab(1)}
              selected={selectedTab === 1}
              title="Send">
                <Send />
            </TabBarIOS.Item>
            <TabBarIOS.Item
              icon={images.request}
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
        </View>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  navigationBarTitle: {
    fontSize: 30,
    fontFamily: "Montserrat-Light",
    fontWeight: "300",
    color: "#FFF",
    textAlign: "center"
  },
})
