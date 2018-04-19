import React from 'react'
import { connect } from 'react-redux'
import { map } from 'ramda'

import { selectors } from 'data'
import SelectBox from '../SelectBox'
import { renameKeys } from 'services/RamdaCookingBook'
import * as languageService from 'services/LanguageService'

class SelectBoxLanguages extends React.PureComponent {
  render () {
    const { languages, ...rest } = this.props
    const items = [...map(renameKeys({ name: 'text', language: 'value' }))(languages)]
    const elements = [{ group: '', items }]

    return <SelectBox elements={elements} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  language: selectors.core.settings.getLanguage(state),
  languages: languageService.languagesSortedByName
})

export default connect(mapStateToProps)(SelectBoxLanguages)
