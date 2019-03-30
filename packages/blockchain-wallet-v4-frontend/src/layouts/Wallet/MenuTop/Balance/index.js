import React from 'react'
import { connect } from 'react-redux'
import { toUpper } from 'ramda'

import { getData } from './selectors'
import Template from './template'

class Balance extends React.PureComponent {
  render () {
    const { path } = this.props
    return <Template coinOrLocation={toUpper(path.split('/')[1])} />
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(Balance)
