import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { map } from 'ramda'

import { renameKeys } from 'services/RamdaCookingBook'
import * as languageService from 'services/LanguageService'
import { actions, selectors } from 'data'
import { SimpleDropdown } from 'components/generic/Dropdown'

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
    const display = languageService.getLanguageName(this.props.culture).getOrElse('en-GB')
    const items = [...map(renameKeys({name: 'text', cultureCode: 'value'}))(this.props.languages)]

    return (
      <SimpleDropdown
        id='language'
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
