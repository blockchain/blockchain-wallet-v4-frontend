import React from 'react'
import FaqRow from './template.js'

class FaqRowContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { toggled: false }
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle () {
    this.setState({ toggled: !this.state.toggled })
  }

  render () {
    return (
      <FaqRow toggled={this.state.toggled} handleToggle={this.handleToggle} {...this.props} />
    )
  }
}

export default FaqRowContainer
