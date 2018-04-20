import React from 'react'
import ui from 'redux-ui'
import FaqRow from './template.js'

class FaqRowContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle () {
    this.props.updateUI({ toggled: !this.props.ui.toggled })
  }

  render () {
    const { title, description, ...rest } = this.props
    return (
      <FaqRow
        {...rest}
        title={title}
        description={description}
        toggled={this.props.ui.toggled}
        handleToggle={this.handleToggle}
      />
    )
  }
}

export default ui({ state: { toggled: false } })(FaqRowContainer)
