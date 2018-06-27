import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import Template from './template'

class Balance extends React.PureComponent {
  state = { btcSubBalance: false, bchSubBalance: false }

  render () {
    return <Template
      path={this.props.path}
      hasBchSubBalance={() => this.setState({ bchSubBalance: true })}
      hasBtcSubBalance={() => this.setState({ btcSubBalance: true })}
      btcSubBalance={this.state.btcSubBalance}
      bchSubBalance={this.state.bchSubBalance}
    />
  }
}

const mapStateToProps = state => ({
  path: selectors.router.getPathname(state)
})

export default connect(mapStateToProps)(Balance)
