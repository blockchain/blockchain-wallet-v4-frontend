import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { Value } from '../model'
import SelectBoxCoin from 'components/Form/SelectBoxCoin'

const FilterText = styled(Value)`
  margin-right: 8px;
  font-size: 16px;
`

const SelectCoinWrapper = styled.div`
  display: flex;
  width: 40%;
  align-items: center;
`

class CoinFilter extends React.PureComponent<InjectedFormProps> {
  onChange = () => {}
  render () {
    return (
      <SelectCoinWrapper>
        <FilterText>
          <FormattedMessage
            id='scenes.interest.history.filter'
            defaultMessage='Filter by:'
          />
        </FilterText>
        <Field
          name='coin'
          onChange={this.onChange}
          label='Select Crypto'
          component={SelectBoxCoin}
          type='request'
          height='32px'
        />
      </SelectCoinWrapper>
    )
  }
}

export default reduxForm({ form: 'interestHistoryCoin' })(CoinFilter)
