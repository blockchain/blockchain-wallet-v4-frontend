import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { selectors } from 'data'
import SelectBox from '../SelectBox'

const CustomSelectBox = styled(SelectBox)`
  * button {
    border-left: none;
  }
  * {
    border-left: none;
  }
`

class SelectBoxCoinifyCurrency extends React.PureComponent {
  render () {
    const { currencies, ...rest } = this.props
    const elements = [{ group: '', items: currencies }]

    return <CustomSelectBox arrowSize='12px' textAlign='center' fontSize='small' label='' elements={elements} borderLeft='none' {...rest} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  currency: selectors.core.settings.getCurrency(state),
  currencies: [
    { text: 'EUR', value: 'EUR' },
    { text: 'DKK', value: 'DKK' },
    { text: 'USD', value: 'USD' },
    { text: 'GBP', value: 'GBP' }
  ]
})

export default connect(mapStateToProps)(SelectBoxCoinifyCurrency)
