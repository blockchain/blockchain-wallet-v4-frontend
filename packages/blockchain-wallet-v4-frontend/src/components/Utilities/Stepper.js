import React from 'react'
import PropTypes from 'prop-types'

const { Provider, Consumer } = React.createContext()

class Stepper extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = { step: props.initialStep }
  }

  // eslint-disable-next-line
  stepTo = (step) => {
    this.setState({ step })
  }

  nextStep = () => {
    this.setState({ step: this.state.step + 1 })
  }

  prevStep = () => {
    this.setState({ step: this.state.step - 1 })
  }

  restartStep = () => {
    this.stepTo(0)
  }

  render () {
    let value = {
      currentStep: this.state.step,
      stepTo: this.stepTo,
      nextStep: this.nextStep,
      prevStep: this.prevStep,
      restartStep: this.restartStep
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

export const StepTransition = ({ Component, onClick, next, prev, restart, to = 0, ...rest }) => (
  <Consumer>
    {({ stepTo, nextStep, prevStep, restartStep }) => {
      const goToStep = next ? nextStep : prev ? prevStep : restart ? restartStep : () => stepTo(to)
      const onClickAndGo = () => {
        onClick && onClick()
        goToStep()
      }
      return (
        <Component
          {...rest}
          onClick={onClickAndGo}
        />
      )
    }}
  </Consumer>
)

export default Stepper
