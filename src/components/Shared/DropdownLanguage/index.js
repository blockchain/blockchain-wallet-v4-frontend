import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import * as languageService from 'services/languageService.js'

import DropdownLanguage from './template.js'
import { actions, selectors } from 'data'

class DropdownLanguageContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClickDropdownLanguage = this.handleClickDropdownLanguage.bind(this)
    this.handleClickItem = this.handleClickItem.bind(this)
  }

  handleClickDropdownLanguage () {
    this.props.uiActions.toggleDropdownLanguage()
  }

  handleClickItem (culture) {
    this.props.preferencesActions.setCulture(culture)
    this.props.uiActions.toggleDropdownLanguage()
  }

  render () {
    let currentLanguageName = languageService.getLanguageName(this.props.culture).getOrElse('en-GB')
    return (
      <DropdownLanguage
        currentLanguageName={currentLanguageName}
        languages={this.props.languages}
        dropdownLanguageDisplayed={this.props.dropdownLanguageDisplayed}
        clickDropdownLanguage={this.handleClickDropdownLanguage}
        clickItem={this.handleClickItem}
        className={this.props.className}
      />
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    culture: selectors.preferences.getCulture(state),
    dropdownLanguageDisplayed: selectors.ui.getDropdownLanguageDisplayed(state),
    languages: languageService.languagesSortedByName
  }
}

function mapDispatchToProps (dispatch) {
  return {
    uiActions: bindActionCreators(actions.ui, dispatch),
    preferencesActions: bindActionCreators(actions.preferences, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropdownLanguageContainer)
