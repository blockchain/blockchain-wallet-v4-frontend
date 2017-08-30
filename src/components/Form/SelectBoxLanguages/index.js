import React from 'react'
import { connect } from 'react-redux'
import { map } from 'ramda'

import { selectors } from 'data'
import { SelectInput } from 'blockchain-info-components'
import { renameKeys } from 'services/RamdaCookingBook'
import * as languageService from 'services/LanguageService'

class SelectBoxLanguages extends React.Component {
  render () {
    const { languages, ...rest } = this.props
    const items = [...map(renameKeys({ name: 'text', cultureCode: 'value' }))(languages)]
    const elements = [{ group: '', items }]

    return <SelectInput elements={elements} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  language: selectors.core.settings.getLanguage(state),
  languages: languageService.languagesSortedByName
})

export default connect(mapStateToProps)(SelectBoxLanguages)
