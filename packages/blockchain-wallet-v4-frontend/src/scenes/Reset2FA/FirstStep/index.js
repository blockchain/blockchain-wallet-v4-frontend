import FirstStep from './template'
import React from 'react'

class FirstStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit () {
    this.props.nextStep()
  }

  render () {
    return <FirstStep {...this.props} onSubmit={this.onSubmit} />
  }
}

export default FirstStepContainer
