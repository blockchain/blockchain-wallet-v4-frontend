import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Header from 'components/Shared/Header'
import * as headerActions from 'data/Header/actions.js'

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
    exploreMenuDisplayed: state.headerState.exploreMenuDisplayed
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(headerActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer)
