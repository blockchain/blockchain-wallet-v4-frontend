import React from 'react'
import { connect } from 'react-redux'

import { getData } from './selectors'
import MenuLeft from './template'

class MenuLeftContainer extends React.PureComponent {
  render () {
    return <MenuLeft toggled={this.props.toggled} />
  }
}

const mapStateToProps = state => getData(state)

export default connect(mapStateToProps)(MenuLeftContainer)
