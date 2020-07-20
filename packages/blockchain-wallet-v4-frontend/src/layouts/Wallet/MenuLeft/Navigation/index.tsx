import { actions } from 'data'
import { bindActionCreators, compose } from 'redux'
import { concat, prop } from 'ramda'
import { connect, ConnectedProps } from 'react-redux'
import Navigation from './template'
import React from 'react'

import { Props as OwnProps } from '../template.success'

class NavigationContainer extends React.PureComponent<Props> {
  render () {
    const { domains } = this.props

    return (
      <Navigation
        {...this.props}
        exchangeUrl={concat(prop('exchange', domains), '/trade')}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(null, mapDispatchToProps)

const enhance = compose(connector)

export type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(NavigationContainer)
