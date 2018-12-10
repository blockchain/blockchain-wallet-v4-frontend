import React, { Component } from 'react'
import modalEnhancer from 'providers/ModalEnhancer'

import ShowXPub from './template'

class ShowXPubContainer extends Component {
  render () {
    return <ShowXPub {...this.props} />
  }
}

export default modalEnhancer('ShowXPub')(ShowXPubContainer)
