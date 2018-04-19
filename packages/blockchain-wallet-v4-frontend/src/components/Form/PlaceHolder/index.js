import React from 'react'
import PlaceHolder from 'blockchain-info-components'

class PlaceHolderContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { displayed: true }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.setState({ displayed: false })
  }

  render () {
    return (
      <PlaceHolder visible={this.state.displayed} handleClick={this.handleClick} />
    )
  }
}

export default PlaceHolderContainer
