import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import SelectBox from '../SelectBox'

class SelectBoxBitcoinUnit extends React.Component {
  render () {
    const { units, ...rest } = this.props
    const elements = [{ group: '', items: units }]

    return <SelectBox elements={elements} {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  unit: selectors.core.settings.getBtcUnit(state),
  units: [
    { text: 'Bitcoin', value: 'BTC' },
    { text: 'milliBit (mBTC)', value: 'MBC' },
    { text: 'bits (uBTC)', value: 'UBC' }
  ]
})

export default connect(mapStateToProps)(SelectBoxBitcoinUnit)
