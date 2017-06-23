import React from 'react'

import FaqRow from './template.js'

class FaqRowContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { detailsDisplayed: false }
  }

  render () {
    let { detailsDisplayed } = this.state
    let handleClickDetails = () => this.setState({ detailsDisplayed: !detailsDisplayed })
    return (
      <FaqRow detailsDisplayed={this.state.detailsDisplayed} clickDetails={handleClickDetails} {...this.props} />
    )
  }
}

export default FaqRowContainer
