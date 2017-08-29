import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions } from 'redux-form'
import { singleForm } from 'providers/FormProvider'
import { equals } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      unit: this.props.unit
    }

    this.handleClick = this.handleClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(nextProps.unit, this.props.unit)) {
      this.props.reduxFormActions.change('settingUnit', this.props.unit)
    }
  }

  handleClick (item) {
    this.setState({ unit: item })
  }

  render () {
    const { ui, uiUpdate, ...rest } = this.props
    return <Settings
      {...rest}
      handleClick={this.handleClick}
      unit={this.state.unit}
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
    singleForm('settingUnit')
)

export default enhance(SettingsContainer)
