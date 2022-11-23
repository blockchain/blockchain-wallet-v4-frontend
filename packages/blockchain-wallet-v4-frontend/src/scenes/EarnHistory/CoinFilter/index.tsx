import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import SelectBoxCoin from 'components/Form/SelectBoxCoin'
import { actions } from 'data'

import { Props as OwnProps, SuccessStateType } from '..'
import { Value } from '../EarnHistory.model'

const FilterText = styled(Value)`
  margin-right: 8px;
  font-size: 16px;
`
const SelectCoinWrapper = styled.div`
  display: flex;
  width: 40%;
  align-items: center;
`

const CoinFilter = ({ earnActions, txPages }: Props) => {
  const onChange = (coinVal) => {
    const coin = coinVal === 'ALL' ? undefined : coinVal
    earnActions.fetchEarnTransactions({ coin, reset: true })
  }
  if (!txPages) return null
  return (
    <SelectCoinWrapper>
      <FilterText>
        <FormattedMessage id='scenes.interest.history.filter' defaultMessage='Filter by:' />
      </FilterText>
      <Field
        component={SelectBoxCoin}
        height='32px'
        name='coin'
        onChange={onChange}
        props={{
          additionalOptions: [{ text: 'All Coins', value: 'ALL' }] as any
        }}
        type='request'
      />
    </SelectCoinWrapper>
  )
}

type Props = ConnectedProps<typeof connector> & OwnProps & SuccessStateType & InjectedFormProps

const mapDispatchToProps = (dispatch: Dispatch) => ({
  earnActions: bindActionCreators(actions.components.interest, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(null, mapDispatchToProps)

const enhance = compose<any>(
  reduxForm({
    form: 'interestHistoryCoin',
    initialValues: { coin: 'ALL' }
  }),
  connector
)

export default enhance(CoinFilter)
