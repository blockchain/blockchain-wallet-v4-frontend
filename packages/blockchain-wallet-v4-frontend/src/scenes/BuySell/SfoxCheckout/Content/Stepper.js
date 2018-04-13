import React from 'react'
import PropTypes from 'prop-types'

const { Provider, Consumer } = React.createContext()

class Stepper extends React.Component {
  state = {
    step: this.props.initialStep
  }

  stepTo = (step) => {
    this.setState({ step })
  }

  nextStep = () => {
    this.stepTo(this.state.step + 1)
  }

  prevStep = () => {
    this.stepTo(this.state.step - 1)
  }

  render () {
    let value = {
      currentStep: this.state.step,
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

export default Stepper
