import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Cookies from 'universal-cookie'

import { SimpleDropdown } from 'blockchain-info-components/src/Dropdowns'
import { actions, selectors } from 'data'
import { languagesSortedByName } from 'services/locales'

class DropdownLanguageContainer extends React.PureComponent {
  handleClick = (selectedLanguage) => {
    const cookies = new Cookies()
    this.props.preferencesActions.setLanguage(selectedLanguage.language, true)
    cookies.set('clang', selectedLanguage.language, {
      domain: '.blockchain.com',
      path: '/'
    })
  }

  render() {
    const { color, currentLanguage, languages, size } = this.props
    const languageList = languages.map((lang) => {
      return {
        language: lang.language,
        text: lang.name,
        value: lang.language
      }
    })

    return (
      <SimpleDropdown
        color={color || 'whiteFade900'}
        uppercase={false}
        items={languageList}
        selectedValue={currentLanguage}
        size={size}
        callback={(selectedLanguage) => this.handleClick(selectedLanguage)}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  currentLanguage: selectors.preferences.getLanguage(state),
  languages: languagesSortedByName
})

const mapDispatchToProps = (dispatch) => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(DropdownLanguageContainer)
