import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import { Route, Redirect } from 'react-router-dom'
import ui from 'redux-ui'

import { actions, selectors } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'
import { Remote } from 'blockchain-wallet-v4/src'

class WalletLayout extends React.Component {
  componentWillMount () {
    if (!Remote.Success.is(this.props.data)) {
      // this is needed because otherwise sign up calls two times component will mount (investigate why)
      this.props.kvStoreBchActions.fetchMetadataBch()
      this.props.kvStoreEthereumActions.fetchMetadataEthereum()
      this.props.kvStoreWhatsnewActions.fetchMetadataWhatsnew()
      this.props.optionsActions.fetchOptions()
      this.props.settingsActions.fetchSettings()
    }
  }

  render () {
    const { data, isAuthenticated, location } = this.props
    return isAuthenticated ? data.cata({
      Success: () => renderLayout(this.props),
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    }) : <Redirect to={{ pathname: '/login', state: { from: location } }} />
  }
}

const renderLayout = ({ ui, updateUI, component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <Success
      location={props.location}
      menuLeftToggled={ui.menuLeftToggled}
      trayRightOpen={ui.trayRightOpen}
      trayRightContent={ui.trayRightContent}
      handleTrayRightToggle={(content) => {
        updateUI({
          trayRightOpen: !ui.trayRightOpen,
          trayRightContent: content
        })
      }}
      handleToggleMenuLeft={() => updateUI({ menuLeftToggled: !ui.menuLeftToggled })}
      handleCloseMenuLeft={() => updateUI({ menuLeftToggled: false })}>
      <Component {...rest} />
    </Success>
  )} />
)

const mapStateToProps = (state) => ({
  data: getData(state),
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

const mapDispatchToProps = (dispatch) => ({
  kvStoreBchActions: bindActionCreators(actions.core.kvStore.bch, dispatch),
  kvStoreEthereumActions: bindActionCreators(actions.core.kvStore.ethereum, dispatch),
  kvStoreWhatsnewActions: bindActionCreators(actions.core.kvStore.whatsNew, dispatch),
  optionsActions: bindActionCreators(actions.core.walletOptions, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({
    key: 'WalletLayout',
    persist: true,
    state: {
      menuLeftToggled: false,
      trayRightOpen: false,
      trayRightContent: ''
    }
  })
)

export default enhance(WalletLayout)
