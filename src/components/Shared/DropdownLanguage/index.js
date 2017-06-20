import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import * as translationService from 'services/translationService.js'

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

  handleClickItem (cultureCode) {
    this.props.preferencesActions.setCulture(cultureCode)
    this.props.uiActions.toggleDropdownLanguage()
  }

  render () {
    let culture = translationService.getLanguageName(this.props.culture).getOrElse('en-GB')
    let languages = translationService.languagesSortedByName
    console.log(this.props.styleName)
    return (
      <DropdownLanguage
        culture={culture}
        languages={languages}
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
    dropdownLanguageDisplayed: selectors.ui.getDropdownLanguageDisplayed(state),
    culture: selectors.preferences.getCulture(state)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    uiActions: bindActionCreators(actions.ui, dispatch),
    preferencesActions: bindActionCreators(actions.preferences, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DropdownLanguageContainer)
