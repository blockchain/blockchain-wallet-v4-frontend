import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import { SelectInput } from 'blockchain-info-components'

class SelectBoxBitcoinUnit extends React.Component {
  render () {
    const { units, ...rest } = this.props
    const elements = [{ group: '', items: units }]

    return <SelectInput elements={elements} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  unit: '', // selectors.core.settings.getBitcoinUnit(state),
  units: [
    { text: 'BTC', value: 'BTC' },
    { text: 'mBTC', value: 'MBC' },
    { text: 'bits', value: 'UBC' }
  ]
})

export default connect(mapStateToProps)(SelectBoxBitcoinUnit)
