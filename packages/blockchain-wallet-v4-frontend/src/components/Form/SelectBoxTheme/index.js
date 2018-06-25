import React from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

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
    { text: <FormattedMessage id='components.selectboxtheme.default' defaultMessage='Default' />, value: 'default' },
    { text: <FormattedMessage id='components.selectboxtheme.complement' defaultMessage='Complement' />, value: 'complement' },
    { text: <FormattedMessage id='components.selectboxtheme.grayscale' defaultMessage='Grayscale' />, value: 'grayscale' },
    { text: <FormattedMessage id='components.selectboxtheme.invert' defaultMessage='Invert' />, value: 'invert' }
  ]
})

export default connect(mapStateToProps)(SelectBoxTheme)
