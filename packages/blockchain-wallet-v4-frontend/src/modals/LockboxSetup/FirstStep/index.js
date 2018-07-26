import React from 'react'
import { connect } from 'react-redux'

import Template from './template'

class FirstStep extends React.PureComponent {
  render () {
    return <Template />
  }
}

export default connect(
  null,
  null
)(FirstStep)
