import React from 'react'

import IPWhitelist from './template.js'

class IPWhitelistContainer extends React.PureComponent {
  render () {
    return <IPWhitelist {...this.props} />
  }
}

export default IPWhitelistContainer
