import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isNil, equals } from 'ramda'

import { actions, model } from 'data'
import Settings from './template'

const { CHANGE_CURRENCY } = model.analytics.PREFERENCE_EVENTS.GENERAL
class SettingsContainer extends React.PureComponent {
  componentDidMount () {
    this.props.formActions.initialize('settingCurrency', {
      currency: this.props.currency
    })
  }

  componentDidUpdate (prevProps) {
    const { currency, newCurrency } = this.props
    if (
      !isNil(newCurrency) &&
      !equals(currency, newCurrency) &&
      !equals(prevProps.newCurrency, newCurrency)
    ) {
      this.props.settingsActions.updateCurrency(newCurrency)
      this.props.analyticsActions.logEvent([...CHANGE_CURRENCY, newCurrency])
    }
  }

  render () {
    return <Settings />
  }
}

const mapStateToProps = state => ({
  newCurrency: formValueSelector('settingCurrency')(state, 'currency')
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsContainer)
