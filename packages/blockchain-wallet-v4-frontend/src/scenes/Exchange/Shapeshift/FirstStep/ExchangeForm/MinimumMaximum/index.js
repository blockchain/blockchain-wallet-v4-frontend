import React from 'react'
import PropTypes from 'prop-types'

import MinimumMaximum from './template'

class MinimumMaximumContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickMinimum = this.handleClickMinimum.bind(this)
    this.handleClickMaximum = this.handleClickMaximum.bind(this)
  }

  handleClickMinimum () {
    console.log('handleClickMinium')
  }

  handleClickMaximum () {
    console.log('handleClickMaximum')
  }

  render () {
    return <MinimumMaximum handleClickMinimum={this.handleClickMinimum} handleClickMaximum={this.handleClickMaximum} />
  }
}

export default MinimumMaximumContainer
