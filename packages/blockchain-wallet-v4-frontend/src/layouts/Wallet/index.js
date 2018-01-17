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

class WalletLayout extends React.Component {
  componentWillMount () {
    this.props.kvStoreEthereumActions.fetchMetadataEthereum()
    this.props.kvStoreWhatsnewActions.fetchMetadataWhatsnew()
    this.props.kvStoreShapeShiftActions.fetchMetadataShapeshift()
    this.props.optionsActions.fetchOptions()
    this.props.settingsActions.fetchSettings()
  }

  render () {
    const { data, isAuthenticated, location } = this.props
    return isAuthenticated ? data.cata({
      Success: (value) => renderLayout(this.props),
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
  kvStoreEthereumActions: bindActionCreators(actions.core.kvStore.ethereum, dispatch),
  kvStoreWhatsnewActions: bindActionCreators(actions.core.kvStore.whatsNew, dispatch),
  kvStoreShapeShiftActions: bindActionCreators(actions.core.kvStore.shapeShift, dispatch),
  optionsActions: bindActionCreators(actions.core.walletOptions, dispatch),
  settingsActions: bindActionCreators(actions.core.settings, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
   ui({ key: 'WalletLayout', persist: true, state: { menuLeftToggled: false } })
)

export default enhance(WalletLayout)
