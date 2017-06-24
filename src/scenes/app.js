import React from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
// import { ConnectedRouter } from 'react-router-redux'
import { ConnectedRouter } from 'connected-react-router'
// import { IntlProvider } from 'react-intl-redux'
import { IntlProvider } from 'react-intl'

import LandingLayout from 'components/Layouts/Landing'
import PublicLayout from 'components/Layouts/Public'
import WalletLayout from 'components/Layouts/Wallet'

import LandingContainer from './Landing'
import LoginContainer from './Login'
import RegisterContainer from './Register'
import HomeContainer from './Home'
import TransactionsContainer from './Transactions'
import BuyContainer from './Buy'
import SecurityCenterContainer from './SecurityCenter'
import InfoContainer from './Info'
import PreferencesContainer from './Preferences'
import SecuritySettingsContainer from './SecuritySettings'
import AddressesContainer from './Addresses'
import FaqContainer from './Faq'

import { selectors } from 'data'
import { isNil, take } from 'ramda'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { locale: 'en', messages: props.messages['en'] }

    props.store.subscribe(() => {
       // Language selection
      // let state = props.store.getState()
      // let language = selectors.core.settings.getLanguage(state)
      // if (isNil(language)) { language = selectors.preferences.getCulture(state) }
      // if (isNil(language)) { language = navigator.language }
      // if (isNil(language)) { language = 'en' }
      // language = take(2, language)
      // this.messages = props.messages[language]

      // this.setState({
      //   locale: language,
      //   messages: this.messages
      // })
    })
  }

  componentWillUpdate () {
    console.log('componentWillUpdate')
  }

  render () {
    console.log(this.props.store.getState().preferences.culture)
    return (
      <Provider store={this.props.store}>
        <IntlProvider locale={this.props.store.getState().preferences.culture} messages={this.props.messages[this.props.store.getState().preferences.culture]}>
          <ConnectedRouter history={this.props.history}>
            <Switch>
              <LandingLayout exact path='/' component={LandingContainer} />
              <PublicLayout path='/login' component={LoginContainer} />
              <PublicLayout path='/register' component={RegisterContainer} />
              <WalletLayout path='/wallet' component={HomeContainer} />
              <WalletLayout path='/transactions' component={TransactionsContainer} />
              <WalletLayout path='/buy-sell' component={BuyContainer} />
              <WalletLayout path='/security-center' component={SecurityCenterContainer} />
              <Redirect from='/settings' to='/settings/info' exact />
              <WalletLayout path='/settings/info' component={InfoContainer} />
              <WalletLayout path='/settings/preferences' component={PreferencesContainer} />
              <WalletLayout path='/settings/security' component={SecuritySettingsContainer} />
              <WalletLayout path='/settings/addresses' component={AddressesContainer} />
              <WalletLayout path='/faq' component={FaqContainer} />
            </Switch>
          </ConnectedRouter>
        </IntlProvider>
      </Provider>
    )
  }
}

export default App
