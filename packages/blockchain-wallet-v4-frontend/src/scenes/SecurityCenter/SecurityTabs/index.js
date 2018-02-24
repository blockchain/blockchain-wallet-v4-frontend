import React from 'react'

import SecurityTabs from './template.js'

class SecurityTabsContainer extends React.Component {
  constructor (props) {
    super(props)

    this.setActive = this.setActive.bind(this)
    this.state = { active: 'security' }
  }

  setActive (active) {
    this.setState({ active })
  }
  render () {
    // const { data } = this.props
    return (
      <SecurityTabs setActive={this.setActive} active={this.state.active} setView={this.props.setView} />
    )
  }
}

export default SecurityTabsContainer
