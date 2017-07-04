import React from 'react'
import {connect} from 'react-redux'

import DidYouKnow from './template.js'

class DidYouKnowContainer extends React.Component {
  render () {
    let info = {
      icon: 'icon-id',
      category: {
        name: 'Educational',
        color: 'brand-success'
      },
      title: 'Your wallet ID cannot be used to send/receive bitcoin',
      description: 'Your wallet ID is like a username, you use it to login to your wallet. To send/receive bitcoin you need a bitcoin address. To generate a new bitcoin address click Receive.'
    }

    return (
      <DidYouKnow info={info} />
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    info: null
  }
}

export default connect(mapStateToProps)(DidYouKnowContainer)
