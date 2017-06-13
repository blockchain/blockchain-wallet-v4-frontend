import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import ExploreMenu from './template.js'
import { actions, selectors } from 'data'

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
    exploreMenuDisplayed: selectors.ui.getExploreMenuDisplayed(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions.ui, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExploreMenuContainer)
