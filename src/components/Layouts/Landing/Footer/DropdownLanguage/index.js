import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { curry, reduce, assoc, keys, map } from 'ramda'

import * as languageService from 'services/languageService.js'
import { actions, selectors } from 'data'
import DropdownLanguage from './template.js'

const renameKeys = curry((keysMap, obj) => reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)))

class DropdownLanguageContainer extends React.Component {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.click = this.click.bind(this)
  }

  toggle () {
    this.props.uiActions.toggleDropdownLanguage()
  }

  click (value) {
    this.props.preferencesActions.setCulture(value)
  }

  render () {
    let display = languageService.getLanguageName(this.props.culture).getOrElse('en-GB')
    let items = [...map(renameKeys({name: 'text', cultureCode: 'value'}))(this.props.languages)]

    return (
      <DropdownLanguage
        display={display}
        items={items}
        dropdownOpen={this.props.dropdownLanguageDisplayed}
        toggle={this.toggle}
        callback={this.click} />
    )
  }
}

let mapStateToProps = (state, ownProps) => ({
  culture: selectors.preferences.getCulture(state),
  dropdownLanguageDisplayed: selectors.ui.getDropdownLanguageDisplayed(state),
  languages: languageService.languagesSortedByName
})

let mapDispatchToProps = (dispatch) => ({
  uiActions: bindActionCreators(actions.ui, dispatch),
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(DropdownLanguageContainer)
