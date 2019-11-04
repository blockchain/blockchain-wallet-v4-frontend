import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import React from 'react'
import Template from './template'

class CurrencySwitchContainer extends React.PureComponent {
  render () {
    const { settings, coinDisplayed, preferencesActions } = this.props
    const { currency } = settings.getOrElse({})

    return (
      <Template
        currency={currency}
        coinDisplayed={coinDisplayed}
        toggleCoinDisplayed={preferencesActions.toggleCoinDisplayed}
      />
    )
  }
}

const mapStateToProps = state => ({
  settings: selectors.core.settings.getSettings(state),
  coinDisplayed: selectors.preferences.getCoinDisplayed(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrencySwitchContainer)
