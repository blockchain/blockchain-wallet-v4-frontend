import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import Template from './template'

class Balance extends React.PureComponent {
  render () {
    return <Template path={this.props.path} />
  }
}

const mapStateToProps = state => ({
  path: selectors.router.getPathname(state)
})

export default connect(mapStateToProps)(Balance)
