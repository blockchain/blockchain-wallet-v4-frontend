import React from 'react'
import { connect } from 'react-redux'
import { assoc, curry, keys, map, reduce } from 'ramda'

import { selectors } from 'data'
import { languagesSortedByName } from 'services/locales'

import SelectBox from '../SelectBox'

const renameKeys = curry((keysMap, obj) =>
  reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
)

class SelectBoxLanguages extends React.PureComponent {
  render() {
    const { language, languages, ...rest } = this.props
    const items = [
      ...map(renameKeys({ name: 'text', language: 'value' }))(languages)
    ]
    const elements = [{ group: '', items }]
    rest.input.value = language

    return <SelectBox elements={elements} {...rest} />
  }
}

const mapStateToProps = state => ({
  language: selectors.preferences.getLanguage(state),
  languages: languagesSortedByName
})

export default connect(mapStateToProps)(SelectBoxLanguages)
