import React from 'react'
import PropTypes from 'prop-types'
import ui from 'redux-ui'

const { Provider, Consumer } = React.createContext()

class Stepper extends React.PureComponent {
  /* eslint-disable */
  stepTo = (step) => {
    this.props.updateUI({ step })
  }
  /* eslint-enable */

  nextStep = () => {
    this.stepTo(this.props.ui.step + 1)
  }

  prevStep = () => {
    this.stepTo(this.props.ui.step - 1)
  }

  render () {
    let value = {
      currentStep: this.props.ui.step,
      stepTo: this.stepTo,
      nextStep: this.nextStep,
      prevStep: this.prevStep
    }

    return (
      <Provider value={value}>
        {this.props.children}
      </Provider>
    )
  }
}

Stepper.propTypes = {
  initialStep: PropTypes.number
}

Stepper.defaultProps = {
  initialStep: 0
}

export const StepView = ({ children, step }) => (
  <Consumer>
    {({ currentStep }) => currentStep === step ? children : null}
  </Consumer>
)

export const StepTransition = ({ Component, next, prev, to = 0, ...rest }) => (
  <Consumer>
    {({ stepTo, nextStep, prevStep }) => (
      <Component
        {...rest}
        onClick={next ? nextStep : prev ? prevStep : () => stepTo(to)}
      />
    )}
  </Consumer>
)

const uiEnhancer = ui({
  state: {
    step: (props) => props.initialStep
  }
})

export default uiEnhancer(Stepper)
