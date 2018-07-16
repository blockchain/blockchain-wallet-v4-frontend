import React from 'react'
import { connect } from 'react-redux'
import { map } from 'ramda'

import { selectors } from 'data'
import SelectBox from '../SelectBox'
import { renameKeys } from 'services/RamdaCookingBook'
import * as languageService from 'services/LanguageService'

class SelectBoxLanguages extends React.PureComponent {
  render () {
    const { language, languages, ...rest } = this.props
    const items = [...map(renameKeys({ name: 'text', language: 'value' }))(languages)]
    const elements = [{ group: '', items }]
    rest.input.value = language

    return <SelectBox elements={elements} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  language: selectors.preferences.getLanguage(state),
  languages: languageService.languagesSortedByName
})

export default connect(mapStateToProps)(SelectBoxLanguages)
