import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'
import SelectBox from '../SelectBox'

class SelectBoxFeeContainer extends React.Component {
  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <SelectBox elements={value} searchEnabled={false} {...rest} />,
      Failure: (message) => <div />,
      Loading: () => <div />,
      NotAsked: () => <div />
    })
  }
}

const mapStateToProps = (state) => ({
  data: selectors.core.data.bitcoin.getFee(state).map(x => [{
    group: '',
    items: [{ text: 'Regular', value: x.regular }, { text: 'Priority', value: x.priority }]
  }])
})

export default connect(mapStateToProps)(SelectBoxFeeContainer)
