import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import SelectBox from '../SelectBox'

class SelectBoxTheme extends React.PureComponent {
  render () {
    const { themes, ...rest } = this.props
    const elements = [{ group: '', items: themes }]

    return <SelectBox elements={elements} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  theme: selectors.preferences.getTheme(state),
  themes: [
    { text: 'Default', value: 'default' },
    { text: 'Complement', value: 'complement' },
    { text: 'Grayscale', value: 'grayscale' },
    { text: 'Invert', value: 'invert' }
  ]
})

export default connect(mapStateToProps)(SelectBoxTheme)
