import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import { Props as OwnProps, SuccessStateType } from '..'
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
  onChange = coin => {
    const { interestActions } = this.props
    interestActions.fetchInterestTransactions(
      true,
      coin === 'ALL' ? undefined : coin
    )
  }

  render () {
    const { txPages } = this.props
    return txPages ? (
      <SelectCoinWrapper>
        <FilterText>
          <FormattedMessage
            id='scenes.interest.history.filter'
            defaultMessage='Filter by:'
          />
        </FilterText>
        <Field
          component={SelectBoxCoin}
          height='32px'
          name='coin'
          onChange={this.onChange}
          props={{
            additionalOptions: [{ text: 'All Coins', value: 'ALL' }] as any
          }}
          type='request'
        />
      </SelectCoinWrapper>
    ) : null
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(null, mapDispatchToProps)
type Props = ConnectedProps<typeof connector> & OwnProps & SuccessStateType

const enhance = compose<any>(
  reduxForm({
    form: 'interestHistoryCoin',
    initialValues: { coin: 'ALL' }
  }),
  connector
)

export default enhance(CoinFilter)
