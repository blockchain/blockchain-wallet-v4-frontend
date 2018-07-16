import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isNil, equals } from 'ramda'

import { actions } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  componentWillMount () {
    this.props.formActions.initialize('settingCurrency', { 'currency': this.props.currency })
  }

  componentWillReceiveProps (nextProps) {
    const { currency, newCurrency } = this.props
    if (!isNil(nextProps.newCurrency) && !equals(currency, nextProps.newCurrency) && !equals(newCurrency, nextProps.newCurrency)) {
      this.props.settingsActions.updateCurrency(nextProps.newCurrency)
    }
  }

  render () {
    return <Settings />
  }
}

const mapStateToProps = (state) => ({
  newCurrency: formValueSelector('settingCurrency')(state, 'currency')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
