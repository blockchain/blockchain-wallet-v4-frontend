import React from 'react'
import FaqRow from './template.js'

class FaqRowContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
    this.state = { toggled: false }
  }

  handleToggle () {
    this.setState({ toggled: !this.state.toggled })
  }

  render () {
    const { title, description, ...rest } = this.props

    return (
      <FaqRow
        {...rest}
        title={title}
        description={description}
        toggled={this.state.toggled}
        handleToggle={this.handleToggle}
      />
    )
  }
}

export default FaqRowContainer
