import React from 'react'

import SecondStep from './template.js'

class SecondStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { index: 0 }
  }
  handleClickPrevious () {
    this.setState({ index: this.state.index - 1 })
  }
  handleClickNext () {
    this.setState({
      index: this.state.index + 1
    })
  }
  render () {
    const { mnemonic } = this.sprops
    return (
      <SecondStep
        {...this.props}
        index={this.state.index}
        word={mnemonic[this.state.index]}
        handleClickPrevious={this.handleClickPrevious}
        handleClickNext={this.handleClickNext}
      />
    )
  }
}

export default SecondStepContainer
