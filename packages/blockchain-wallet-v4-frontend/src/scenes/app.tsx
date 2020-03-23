import { connect, Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { createGlobalStyle } from 'styled-components'
import { FontGlobalStyles, IconGlobalStyles } from 'blockchain-info-components'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import { PersistGate } from 'redux-persist/integration/react'
import { Redirect, Switch } from 'react-router-dom'
import { selectors } from 'data'
import AnalyticsTracker from 'providers/AnalyticsTracker'
import React, { Suspense } from 'react'
import ThemeProvider from 'providers/ThemeProvider'
import TranslationsProvider from 'providers/TranslationsProvider'
const WalletSwitch = React.lazy(() => import('./wallet'))
const PublicSwitch = React.lazy(() => import('./public'))

const GlobalStyle = createGlobalStyle`
  html, body, #app, #app > div {padding: 0; margin: 0; height: 100%;}
  html, body {overflow: hidden;}
  /* hide scrollbars */
  ::-webkit-scrollbar {
    display: none;
  }
  * {
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-font-smoothing: antialiased;
  }
`

class App extends React.PureComponent<{
  history: any
  isAuthenticated: boolean
  persistor: any
  store: any
  supportedCoins: any
}> {
  render () {
    const {
      store,
      history,
      persistor,
      isAuthenticated,
      supportedCoins
    }: {
      history: any
      isAuthenticated: boolean
      persistor: any
      store: any
      supportedCoins: any
    } = this.props
    return (
      <Provider store={store}>
        <TranslationsProvider>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <MediaContextProvider>
                <ConnectedRouter history={history}>
                  <Switch>
                    <Suspense fallback={<div>Loading...</div>}>
                      <PublicSwitch />
                      {isAuthenticated && (
                        <WalletSwitch supportedCoins={supportedCoins} />
                      )}
                      {isAuthenticated ? (
                        <Redirect from='/' to='/home' />
                      ) : (
                        <Redirect from='/' to='/login' />
                      )}
                    </Suspense>
                  </Switch>
                </ConnectedRouter>
                <AnalyticsTracker />
                <FontGlobalStyles />
                <IconGlobalStyles />
                <GlobalStyle />
              </MediaContextProvider>
            </ThemeProvider>
          </PersistGate>
        </TranslationsProvider>
      </Provider>
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: selectors.auth.isAuthenticated(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})

export default connect(mapStateToProps)(App)
