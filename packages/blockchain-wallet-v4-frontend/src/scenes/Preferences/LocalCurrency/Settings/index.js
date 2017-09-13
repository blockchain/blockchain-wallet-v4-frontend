import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions as reduxFormActions } from 'redux-form'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount () {
    this.props.reduxFormActions.initialize('settingCurrency', { 'currency': this.props.currency })
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(nextProps.currency, this.props.currency)) {
      this.props.reduxFormActions.change('settingCurrency', 'currency', nextProps.currency)
    }
  }

  handleClick (value) {
    const { guid, sharedKey } = this.props
    this.props.settingsActions.updateCurrency(guid, sharedKey, value)
  }

  render () {
    return <Settings {...this.props} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  currency: selectors.core.settings.getCurrency(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
