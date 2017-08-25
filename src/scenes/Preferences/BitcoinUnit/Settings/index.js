import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions } from 'redux-form'
import { singleForm } from 'providers/FormProvider'
import ui from 'redux-ui'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(nextProps.unit, this.props.unit)) {
      this.props.reduxFormActions.change('settingUnit', this.props.unit)
    }
  }

  handleClick () {
    console.log('click')
  }

  handleToggle () {
    this.props.updateUI({ toggled: !this.props.ui.toggled })
  }

  render () {
    const { ui, uiUpdate, ...rest } = this.props
    return <Settings
      {...rest}
      toggled={ui.toggled}
      handleToggle={this.handleToggle}
      handleClick={this.handleClick}
        />
  }
}

const mapStateToProps = (state) => ({
  unit: selectors.core.settings.getBtcCurrency(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.core.settings, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    ui({ key: 'Setting_unit', state: { toggled: false } }),
    singleForm('settingUnit')
)

export default enhance(SettingsContainer)
