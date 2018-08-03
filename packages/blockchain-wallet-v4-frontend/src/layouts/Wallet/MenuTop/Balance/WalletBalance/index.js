import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import Template from './template'

class Balance extends React.PureComponent {
  render () {
    const { settings } = this.props
    const { currency } = settings.getOrElse({})
    return <Template currency={currency} />
  }
}

const mapStateToProps = state => ({
  settings: selectors.core.settings.getSettings(state)
})

export default connect(mapStateToProps)(Balance)
