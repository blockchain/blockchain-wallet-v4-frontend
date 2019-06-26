import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { languagesSortedByName } from 'services/LocalesService'
import { SimpleDropdown } from 'blockchain-info-components/src/Dropdowns'
import { actions, selectors } from 'data'

class DropdownLanguageContainer extends React.PureComponent {
  handleClick = selectedLanguage => {
    this.props.preferencesActions.setCulture(selectedLanguage.value)
    this.props.preferencesActions.setLanguage(selectedLanguage.language, true)
  }

  render () {
    const { currentLanguage, languages } = this.props
    const languageList = languages.map(lang => {
      return {
        text: lang.name,
        value: lang.language,
        language: lang.language
      }
    })

    return (
      <SimpleDropdown
        color='white'
        uppercase={false}
        items={languageList}
        selectedValue={currentLanguage}
        callback={selectedLanguage => this.handleClick(selectedLanguage)}
      />
    )
  }
}

const mapStateToProps = state => ({
  currentLanguage: selectors.preferences.getLanguage(state),
  languages: languagesSortedByName
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropdownLanguageContainer)
