import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import SelectBoxCoin from 'components/Form/SelectBoxCoin'
import { actions } from 'data'

import { Props as OwnProps, SuccessStateType } from '../..'

const SelectCoinWrapper = styled.div`
  display: flex;
  min-width: 240px;
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
      <Field
        component={SelectBoxCoin}
        height='48px'
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
    form: 'earnHistoryCoin',
    initialValues: { coin: 'ALL' }
  }),
  connector
)

export default enhance(CoinFilter)
