import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'

import WhatsNew from './template.js'

class WhatsNewContainer extends React.PureComponent {
  render () {
    const { handleTrayRightToggle } = this.props
    return (
      <WhatsNew handleTrayRightToggle={handleTrayRightToggle}/>
    )
  }
}

const mapStateToProps = (state) => ({
  countryCode: selectors.core.settings.getCountryCode(state)
})

export default connect(mapStateToProps, undefined)(WhatsNewContainer)
