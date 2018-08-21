import React from 'react'
import { connect } from 'react-redux'
import Template from './template'
import { getData } from './selectors'

class BalancesTableContainer extends React.PureComponent {
  render () {
    return <Template currentTab={this.props.currentTab} />
  }
}

export const mapStateToProps = state => ({
  currentTab: getData(state)
})

export default connect(mapStateToProps)(BalancesTableContainer)
