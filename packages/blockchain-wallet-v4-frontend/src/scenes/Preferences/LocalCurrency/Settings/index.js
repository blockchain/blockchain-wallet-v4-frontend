import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount () {
    this.props.formActions.initialize('settingCurrency', { 'currency': this.props.currency })
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(nextProps.currency, this.props.currency)) {
      this.props.formActions.change('settingCurrency', 'currency', nextProps.currency)
    }
  }

  handleClick (value) {
    this.props.settingsActions.updateCurrency(value)
  }

  render () {
    return <Settings {...this.props} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  currency: selectors.core.settings.getCurrency(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
