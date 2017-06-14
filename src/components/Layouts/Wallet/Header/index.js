import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Header from './template.js'
import { actions } from 'data'

class HeaderContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickExploreMenu = this.handleClickExploreMenu.bind(this)
  }

  handleClickExploreMenu () {
    this.props.actions.toggleExploreMenu()
  }

  render () {
    return (
      <Header exploreMenuDisplayed={this.props.exploreMenuDisplayed} clickExploreMenu={this.handleClickExploreMenu} />
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    exploreMenuDisplayed: state.applicationState.ui.exploreMenuDisplayed
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.ui, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer)
