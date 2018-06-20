import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'ramda'

import wizardProvider from 'providers/WizardProvider'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import { actions } from '../../data'

class Reset2FAContainer extends React.PureComponent {
  componentWillMount () {
    this.props.resetStep()
  }

  componentWillUnmount () {
    this.props.formActions.destroy('reset2FA')
  }

  render () {
    const { step, ...rest } = this.props

    switch (step) {
      case 1: return <FirstStep {...rest} />
      case 2: return <SecondStep {...rest} />
      case 3: return <ThirdStep {...rest} />
      default: return <FirstStep {...rest} />
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(null, mapDispatchToProps),
  wizardProvider('reset2FA', 3)
)

export default enhance(Reset2FAContainer)
