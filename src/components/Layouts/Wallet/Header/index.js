import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Header from './template.js'
import { actions, selectors } from 'data'

class HeaderContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickHeaderMenu = this.handleClickHeaderMenu.bind(this)
  }

  handleClickHeaderMenu () {
    this.props.actions.toggleHeaderMenu()
  }

  render () {
    return (
      <Header
        headerMenuDisplayed={this.props.headerMenuDisplayed}
        clickHeaderMenu={this.handleClickHeaderMenu}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    headerMenuDisplayed: selectors.ui.getHeaderMenuDisplayed(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions.ui, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer)
