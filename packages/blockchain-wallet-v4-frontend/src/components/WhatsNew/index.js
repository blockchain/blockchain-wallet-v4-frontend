import React from 'react'
import { connect } from 'react-redux'
import { selectors } from 'data'

import WhatsNewLeora from './template.js'

class WhatsNewLeoraContainer extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { handleTrayRightToggle } = this.props
    return (
      <WhatsNewLeora handleTrayRightToggle={handleTrayRightToggle}/>
    )
  }
}

const mapStateToProps = (state) => ({
  countryCode: selectors.core.settings.getCountryCode(state)
})

export default connect(mapStateToProps, undefined)(WhatsNewLeoraContainer)
