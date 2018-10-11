import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Template from './template'

class Balance extends React.PureComponent {
  render () {
    const { path, showLockbox } = this.props
    return <Template path={path} showLockbox={showLockbox} />
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Balance)
