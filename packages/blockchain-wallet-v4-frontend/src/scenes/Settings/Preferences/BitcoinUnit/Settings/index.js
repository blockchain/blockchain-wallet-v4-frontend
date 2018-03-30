import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { formValueSelector } from 'redux-form'
import { isNil, equals } from 'ramda'

import { actions } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  componentWillMount () {
    this.props.formActions.initialize('settingUnit', { 'unit': this.props.unit })
  }

  componentWillReceiveProps (nextProps) {
    const { unit, newUnit } = this.props
    if (!isNil(nextProps.newUnit) && !equals(unit, nextProps.newUnit) && !equals(newUnit, nextProps.newUnit)) {
      this.props.settingsActions.updateBitcoinUnit(nextProps.newUnit)
    }
  }

  render () {
    return <Settings {...this.props} handleClick={this.handleClick} />
  }
}

const mapStateToProps = (state) => ({
  newUnit: formValueSelector('settingUnit')(state, 'unit')
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer)
