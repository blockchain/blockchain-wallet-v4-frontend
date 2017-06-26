import React from 'react'
import MenuTop from './template.js'

class MenuTopContainer extends React.Component {
  render () {
    console.log(this.props)
    return (
      <MenuTop {...this.props} />
    )
  }
}

export default MenuTopContainer
