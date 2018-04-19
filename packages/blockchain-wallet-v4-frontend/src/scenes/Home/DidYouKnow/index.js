import React from 'react'

import DidYouKnow from './template.js'

class DidYouKnowContainer extends React.PureComponent {
  componentWillMount () {
    this.number = Math.trunc((Math.random() * 23) + 1)
  }
  render () {
    return (
      <DidYouKnow number={this.number} />
    )
  }
}

export default DidYouKnowContainer
