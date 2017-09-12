import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import SecondStep from './template.js'

class SecondStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.words = this.props.mnemonic.split(' ')
    this.state = { currentIndex: 0, currentWord: this.words[0] }
    this.nextWord = this.nextWord.bind(this)
    this.previousWord = this.previousWord.bind(this)
  }

  nextWord () {
    const index = this.state.currentIndex
    const currentIndex = index < 11 ? index + 1 : 11
    this.setState({ currentIndex, currentWord: this.words[currentIndex] })
  }

  previousWord () {
    const index = this.state.currentIndex
    const currentIndex = index > 0 ? index - 1 : 0
    this.setState({ currentIndex, currentWord: this.words[currentIndex] })
  }

  render () {
    return <SecondStep
      {...this.props}
      currentIndex={this.state.currentIndex}
      currentWord={this.state.currentWord}
      nextWord={this.nextWord}
      previousWord={this.previousWord}
    />
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    mnemonic: selectors.core.wallet.getMnemonic(state)
  }
}

export default connect(mapStateToProps)(SecondStepContainer)
