import React from 'react'

import MenuLeft from './template.js'

class MenuLeftContainer extends React.Component {
  render () {
    return (
      <MenuLeft location={this.props.location} />
    )
  }
}

export default MenuLeftContainer
