import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { ui } from 'data/rootSelectors'

import ExploreMenu from './template.js'
import * as uiActions from 'data/UI/actions.js'

class ExploreMenuContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickExploreMenu = this.handleClickExploreMenu.bind(this)
  }

  handleClickExploreMenu () {
    this.props.actions.toggleExploreMenu()
  }

  render () {
    return (
      <ExploreMenu exploreMenuDisplayed={this.props.exploreMenuDisplayed} clickExploreMenu={this.handleClickExploreMenu} />
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    exploreMenuDisplayed: ui.getExploreMenuDisplayed(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreMenuContainer)
