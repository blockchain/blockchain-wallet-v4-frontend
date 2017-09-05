
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions as reduxFormActions, formValueSelector } from 'redux-form'
import { singleForm } from 'providers/FormProvider'
import ui from 'redux-ui'
import { equals, isEmpty } from 'ramda'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentWillMount () {
    if (!isEmpty(this.props.secondPassword)) {
      this.props.reduxFormActions.initialize('settingSecondPassword', { secondPassword: this.props.secondPassword })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!equals(this.props.secondPassword, nextProps.secondPassword)) {
      this.props.updateUI({ updateToggled: false })
    }
    if (equals(this.props.secondPassword, nextProps.secondPassword) && !equals(this.props.secondPasswordEnabled, nextProps.secondPasswordEnabled)) {
      this.props.updateUI({ updateToggled: false })
    }
  }

  handleClick () {
    if (this.props.secondPasswordEnabled) {
      // CASE: Remove second password
      // Check second password value is secondPassword before
      // Here use actions to remove secondPassword
    } else {
      // CASE: Set second password
      const { secondPasswordValue } = this.props
      this.props.walletActions.toggleSecondPassword(secondPasswordValue)
    }
    this.handleToggle()
  }

  handleToggle () {
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  render () {
    const { ui, uiUpdate, ...rest } = this.props

    return <Settings
      {...rest}
      updateToggled={ui.updateToggled}
      handleToggle={this.handleToggle}
      handleClick={this.handleClick}
    />
  }
}

const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state),
  sharedKey: selectors.core.wallet.getSharedKey(state),
  // secondPassword: selectors.core.wallet.getSecondPassword(state),
  // secondPasswordEnabled: selectors.core.wallet.getSecondPasswordEnabled(state),
  secondPasswordValue: formValueSelector('settingSecondPassword')(state, 'secondPassword'),
  code: formValueSelector('settingSecondPassword')(state, 'code')
})

const mapDispatchToProps = (dispatch) => ({
  walletActions: bindActionCreators(actions.core.wallet, dispatch),
  reduxFormActions: bindActionCreators(reduxFormActions, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_SecondPassword', state: { updateToggled: false } }),
  singleForm('settingSecondPassword')
)

SettingContainer.propTypes = {
  secondPassword: PropTypes.string
}

export default enhance(SettingContainer)
