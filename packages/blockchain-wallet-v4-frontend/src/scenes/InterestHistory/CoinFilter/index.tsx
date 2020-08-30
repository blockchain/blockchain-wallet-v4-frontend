import { actions } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'

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

class CoinFilter extends React.PureComponent<InjectedFormProps & Props> {
  onChange = (e, val) => {
    this.props.interestActions.fetchInterestTransactions(true, val)
  }
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(null, mapDispatchToProps)
type Props = ConnectedProps<typeof connector>

const enhance = compose<any>(
  reduxForm({ form: 'interestHistoryCoin' }),
  connector
)

export default enhance(CoinFilter)
