import React from 'react'

import WhatsNew from './template.js'

class WhatsNewContainer extends React.PureComponent {
  render () {
    const { handleTrayRightToggle } = this.props
    return (
      <WhatsNew handleTrayRightToggle={handleTrayRightToggle} />
    )
  }
}

export default WhatsNewContainer
