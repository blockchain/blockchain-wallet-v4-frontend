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
    this.props.formActions.initialize('settingUnit', { 'unit': this.props.unit })
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(nextProps.unit, this.props.unit)) {
      this.props.formActions.change('settingUnit', 'unit', nextProps.unit)
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
  unit: selectors.core.settings.getBtcUnit(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
