import React from 'react'

import FirstStep from './template'

class FirstStepContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit() {
    this.props.nextStep()
  }

  render() {
    return <FirstStep {...this.props} onSubmit={this.onSubmit} />
  }
}

export default FirstStepContainer
