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
    this.props.reduxFormActions.initialize('settingUnit', { 'unit': this.props.unit })
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(nextProps.unit, this.props.unit)) {
      this.props.reduxFormActions.change('settingUnit', 'unit', nextProps.unit)
    }
  }

  handleClick (value) {
    this.props.settingsActions.updateBitcoinUnit(value)
  }

  render () {
    return <Settings {...this.props} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcCurrency(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.settings, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
