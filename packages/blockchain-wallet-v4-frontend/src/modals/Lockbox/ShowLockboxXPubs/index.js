import React from 'react'

import modalEnhancer from 'providers/ModalEnhancer'
import ShowLockboxXPubs from './template'

class ShowLockboxXPubsContainer extends React.PureComponent {
  render () {
    return <ShowLockboxXPubs {...this.props} />
  }
}

export default modalEnhancer('ShowLockboxXPubs')(ShowLockboxXPubsContainer)
