import React from 'react'
import SecondStep from './template'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    this.props.nextStep()
  }

  render () {
    return <SecondStep {...this.props} onSubmit={this.onSubmit} />
  }
}

export default SecondStepContainer
