import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Header from './template.js'
import { actions, selectors } from 'data'

class HeaderContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickHeaderMenu = this.handleClickHeaderMenu.bind(this)
    this.handleClickExploreMenu = this.handleClickExploreMenu.bind(this)
  }

  handleClickHeaderMenu () {
    this.props.actions.toggleHeaderMenu()
  }

  handleClickExploreMenu () {
    this.props.actions.toggleExploreMenu()
  }

  render () {
    return (
      <Header
        headerMenuDisplayed={this.props.headerMenuDisplayed}
        clickHeaderMenu={this.handleClickHeaderMenu}
        exploreMenuDisplayed={this.props.exploreMenuDisplayed}
        clickExploreMenu={this.handleClickExploreMenu}
      />
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    headerMenuDisplayed: selectors.ui.getHeaderMenuDisplayed(state),
    exploreMenuDisplayed: selectors.ui.getExploreMenuDisplayed(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.ui, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer)
