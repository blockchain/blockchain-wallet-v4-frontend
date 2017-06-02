import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import Footer from './template.js'
import * as uiActions from 'data/UI/actions.js'

class FooterContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickLanguageMenu = this.handleClickLanguageMenu.bind(this)
  }

  handleClickLanguageMenu () {
    this.props.actions.toggleLanguageMenu()
  }

  render () {
    return (
      <Footer languageMenuDisplayed={this.props.languageMenuDisplayed} clickLanguageMenu={this.handleClickLanguageMenu} />
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    languageMenuDisplayed: state.applicationState.ui.languageMenuDisplayed
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(uiActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FooterContainer)
