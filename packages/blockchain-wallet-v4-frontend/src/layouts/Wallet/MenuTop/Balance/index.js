import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import Template from './template'

// TODO: pass in a model and build template dynamically instead of switch statements
class Balance extends React.PureComponent {
  render () {
    const { path } = this.props
    return <Template path={path} />
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Balance)
