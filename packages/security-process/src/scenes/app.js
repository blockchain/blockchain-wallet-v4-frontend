import React, { useEffect } from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { connect, Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react'
import { createGlobalStyle } from 'styled-components'

import { selectors } from 'data'
import { IconGlobalStyles, FontGlobalStyles } from 'blockchain-info-components'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import AnalyticsTracker from 'providers/AnalyticsTracker'
import TranslationsProvider from 'providers/TranslationsProvider'
import PublicLayout from 'layouts/Public'
import SecurityLayout from 'layouts/Security'
import ThemeProvider from 'providers/ThemeProvider'

import AuthorizeLogin from './AuthorizeLogin'
import Help from './Help'
import Login from './Login'
import Logout from './Logout'
import MobileLogin from './MobileLogin'
import Recover from './Recover'
import Register from './Register'
import Reminder from './Reminder'
import Reset2FA from './Reset2FA'
import Reset2FAToken from './Reset2FAToken'
import SecurityCenter from './SecurityCenter'
import Home from './Home'
import VerifyEmailToken from './VerifyEmailToken'

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

const SetForegroundProcess = ({ children, imports }) => {
  useEffect(() => {
    imports.setForegroundProcess()
  })

  return <React.Fragment>{children}</React.Fragment>
}

class App extends React.PureComponent {
  render () {
    const { imports, store, history, persistor, isAuthenticated } = this.props
    return (
      <Provider store={store}>
        <TranslationsProvider>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <MediaContextProvider>
                <ConnectedRouter history={history}>
                  <SetForegroundProcess imports={imports}>
                    <Switch>
                      <PublicLayout path='/login' component={Login} />
                      <PublicLayout path='/logout' component={Logout} />
                      <PublicLayout path='/help' component={Help} />
                      <PublicLayout path='/recover' component={Recover} />
                      <PublicLayout path='/reminder' component={Reminder} />
                      <PublicLayout path='/reset-2fa' component={Reset2FA} />
                      <PublicLayout
                        path='/mobile-login'
                        component={MobileLogin}
                      />
                      <PublicLayout
                        path='/reset-two-factor'
                        component={Reset2FAToken}
                      />
                      <PublicLayout
                        path='/verify-email'
                        component={VerifyEmailToken}
                      />
                      <PublicLayout path='/signup' component={Register} />
                      <PublicLayout
                        path='/authorize-approve'
                        component={AuthorizeLogin}
                      />
                      <SecurityLayout
                        path='/security-center'
                        component={SecurityCenter}
                      />
                      <SecurityLayout path='/home' component={Home} />
                      {isAuthenticated ? (
                        <Redirect from='/' to='/home' />
                      ) : (
                        <Redirect from='/' to='/login' />
                      )}
                    </Switch>
                  </SetForegroundProcess>
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
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

export default connect(mapStateToProps)(App)
