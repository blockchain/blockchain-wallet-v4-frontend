import React from 'react'
import SecondStep from './template.js'
import { compose, values, pickAll } from 'ramda'

class SecondStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      step: 1
    }
    this.handleClickPrevious = this.handleClickPrevious.bind(this)
    this.handleClickNext = this.handleClickNext.bind(this)
    this.getWordsAtStep = this.getWordsAtStep.bind(this)
  }
  handleClickPrevious () {
    this.setState({ step: this.state.step - 1 })
  }
  handleClickNext () {
    this.setState({ step: this.state.step + 1 })
  }
  getWordsAtStep (step) {
    const pickIndexes = compose(
      values,
      pickAll
    )
    switch (step) {
      case 1:
        return pickIndexes([0, 1, 2, 3], this.props.recoveryPhrase)
      case 2:
        return pickIndexes([4, 5, 6, 7], this.props.recoveryPhrase)
      case 3:
        return pickIndexes([8, 9, 10, 11], this.props.recoveryPhrase)
    }
  }
  render () {
    return (
      <SecondStep
        {...this.props}
        step={this.state.step}
        words={this.getWordsAtStep(this.state.step)}
        handleClickPrevious={this.handleClickPrevious}
        handleClickNext={this.handleClickNext}
      />
    )
  }
}

export default SecondStepContainer
