
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'
import ui from 'redux-ui'

import { actions, selectors } from 'data'
import Settings from './template.js'

class SettingsContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    const { secondPasswordValue } = this.props
    this.props.walletActions.toggleSecondPassword(secondPasswordValue)
    this.handleToggle()
  }

  handleToggle () {
    this.props.updateUI({ updateToggled: !this.props.ui.updateToggled })
  }

  render () {
    const { ui, ...rest } = this.props

    return <Settings
      {...rest}
      updateToggled={ui.updateToggled}
      handleToggle={this.handleToggle}
      handleSubmit={this.handleSubmit}
      handleCancel={() => { this.props.formActions.reset('settingSecondPassword'); this.handleToggle() }}
    />
  }
}

const mapStateToProps = (state) => ({
  mainPassword: selectors.core.wallet.getMainPassword(state),
  secondPasswordEnabled: selectors.core.wallet.isSecondPasswordOn(state),
  secondPasswordValue: formValueSelector('settingSecondPassword')(state, 'secondPassword')
})

const mapDispatchToProps = (dispatch) => ({
  walletActions: bindActionCreators(actions.wallet, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Setting_SecondPassword', state: { updateToggled: false } })
)

export default enhance(SettingsContainer)
