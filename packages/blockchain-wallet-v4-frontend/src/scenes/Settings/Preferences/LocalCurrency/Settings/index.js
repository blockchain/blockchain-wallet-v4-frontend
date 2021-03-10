import React from 'react'
import { connect } from 'react-redux'
import { equals, isNil } from 'ramda'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'

import { actions } from 'data'

import Settings from './template'

class SettingsContainer extends React.PureComponent {
  componentDidMount() {
    this.props.formActions.initialize('settingCurrency', {
      currency: this.props.currency
    })
  }

  componentDidUpdate(prevProps) {
    const { currency, newCurrency } = this.props
    if (
      !isNil(newCurrency) &&
      !equals(currency, newCurrency) &&
      !equals(prevProps.newCurrency, newCurrency)
    ) {
      this.props.settingsActions.updateCurrency(newCurrency)
    }
  }

  render() {
    return <Settings />
  }
}

const mapStateToProps = state => ({
  newCurrency: formValueSelector('settingCurrency')(state, 'currency')
})

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
