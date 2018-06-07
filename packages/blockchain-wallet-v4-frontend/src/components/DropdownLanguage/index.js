import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import ui from 'redux-ui'

import * as languageService from 'services/LanguageService'
import { SimpleDropdown } from 'blockchain-info-components/src/Dropdowns'
import { actions, selectors } from 'data'

class DropdownLanguageContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (selectedLanguage) {
    this.props.preferencesActions.setCulture(selectedLanguage.value)
    this.props.preferencesActions.setLanguage(selectedLanguage.language)
  }

  render () {
    const { currentLanguage, languages } = this.props
    const languageList = languages.map((lang) => {
      return {
        text: lang.name,
        value: lang.language,
        language: lang.language
      }
    })

    return (
      <SimpleDropdown color='white' items={languageList} selectedValue={currentLanguage} callback={(selectedLanguage) => this.handleClick(selectedLanguage)} />
    )
  }
}

const mapStateToProps = (state) => ({
  currentLanguage: selectors.preferences.getLanguage(state),
  languages: languageService.languagesSortedByName
})

const mapDispatchToProps = (dispatch) => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ state: { toggled: false } })
)

export default enhance(DropdownLanguageContainer)
