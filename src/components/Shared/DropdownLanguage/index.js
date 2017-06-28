import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as languageService from 'services/languageService.js'
import { actions, selectors } from 'data'
import DropdownLanguageItem from './DropdownLanguageItem'

export const DropdownLanguage = (props) => (
  <div className={`dropdown ${props.dropdownLanguageDisplayed && 'show'} ${props.className}`}>
    <a className='dropdown-toggle' id='dropdownLanguage' data-toggle='dropdown' aria-haspopup={props.dropdownLanguageDisplayed}
      aria-expanded={props.dropdownLanguageDisplayed} onClick={props.clickDropdownLanguage}>
      {props.currentLanguageName}
    </a>
    <div className='dropdown-menu' aria-labelledby='dropdownLanguage'>
      {props.languages.map((language, index) => (
        <DropdownLanguageItem
          key={index}
          name={language.name}
          culture={language.cultureCode}
          clickItem={props.clickItem}
        />
      ))}
    </div>
  </div>
)

DropdownLanguage.propTypes = {
  currentLanguageName: PropTypes.string.isRequired,
  languages: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    cultureCode: PropTypes.string.isRequired
  })),
  dropdownLanguageDisplayed: PropTypes.bool.isRequired,
  clickDropdownLanguage: PropTypes.func.isRequired,
  clickItem: PropTypes.func.isRequired,
  className: PropTypes.string
}

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
