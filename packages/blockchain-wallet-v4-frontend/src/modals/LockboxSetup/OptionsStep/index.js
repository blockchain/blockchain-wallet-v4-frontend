import React from 'react'
import { connect } from 'react-redux'

import Template from './template'

class OptionsStep extends React.PureComponent {
  render () {
    return <Template {...this.props} />
  }
}

export default connect(
  null,
  null
)(OptionsStep)
