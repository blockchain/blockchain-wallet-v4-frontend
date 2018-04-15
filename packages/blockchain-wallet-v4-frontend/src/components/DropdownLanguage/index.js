import React from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import ui from 'redux-ui'

import * as languageService from 'services/LanguageService'
import { SimpleDropdown } from 'blockchain-info-components/src/Dropdowns'
import { actions, selectors } from 'data'

class DropdownLanguageContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (selectedLanguage) {
    this.props.preferencesActions.setCulture(selectedLanguage.value)
    this.props.preferencesActions.setLanguage(selectedLanguage.language)
  }

  render () {
    const { currentCulture, languages } = this.props
    const languageList = languages.map((lang) => {
      return {
        text: lang.name,
        value: lang.cultureCode,
        language: lang.language
      }
    })

    return (
      <SimpleDropdown color='white' items={languageList} selectedValue={currentCulture} callback={(selectedLanguage) => this.handleClick(selectedLanguage)} />
    )
  }
}

const mapStateToProps = (state) => ({
  currentCulture: selectors.preferences.getCulture(state),
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
