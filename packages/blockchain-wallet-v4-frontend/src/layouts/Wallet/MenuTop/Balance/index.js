import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Template from './template'

class Balance extends React.PureComponent {
  render () {
    const { path, lockboxEnabled } = this.props
    return <Template path={path} lockboxEnabled={lockboxEnabled} />
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Balance)
