import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'

import wizardProvider from 'providers/WizardProvider'
import { getData } from './selectors'
import { actions } from 'data'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'

class ShapeshiftContainer extends React.Component {
  componentWillMount () {
    this.props.resetStep()
  }

  componentWillUnmount () {
    this.props.formActions.destroy('exchange')
  }

  render () {
    switch (this.props.step) {
      case 1: return <FirstStep {...this.props} />
      case 2: return <SecondStep {...this.props} />
      case 3: return <ThirdStep {...this.props} />
      default: return <div />
    }
  }
}

const mapStateToProps = state => ({
  ...getData(state)
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  wizardProvider('exchange', 2),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(ShapeshiftContainer)
