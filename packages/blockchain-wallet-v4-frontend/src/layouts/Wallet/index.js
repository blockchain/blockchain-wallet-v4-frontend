import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Route, Redirect } from 'react-router-dom'
import ui from 'redux-ui'

import { selectors } from 'data'
import WalletLayout from './template.js'

class WalletLayoutContainer extends React.Component {
  render () {
    const { ui, updateUI, resetUI, component: Component, isAuthenticated, ...rest } = this.props

    return (
      <Route {...rest} render={props => (isAuthenticated
      ? (
        <WalletLayout
          location={props.location}
          menuLeftToggled={ui.menuLeftToggled}
          handleToggleMenuLeft={() => updateUI({ menuLeftToggled: !ui.menuLeftToggled })}
          handleCloseMenuLeft={() => updateUI({ menuLeftToggled: false })}>
          <Component {...rest} />
        </WalletLayout>
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      )} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: selectors.auth.isAuthenticated(state)
  }
}

const enhance = compose(
  connect(mapStateToProps),
   ui({ key: 'WalletLayout', persist: true, state: { menuLeftToggled: false } })
)

export default enhance(WalletLayoutContainer)
