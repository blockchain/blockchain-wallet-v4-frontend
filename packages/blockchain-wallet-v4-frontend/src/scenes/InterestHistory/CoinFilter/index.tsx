import { actions } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'

import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
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

  handleClear = () => {
    this.props.reset()
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
          value=''
        >
          {' '}
        </Field>
        <Icon
          cursor
          data-e2e='interestClearFilter'
          name='close'
          size='14px'
          color='grey600'
          role='button'
          onClick={this.handleClear}
          z-index='10'
        />
      </SelectCoinWrapper>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(null, mapDispatchToProps)
type Props = ConnectedProps<typeof connector>

const enhance = compose<any>(
  reduxForm({
    form: 'interestHistoryCoin'
  }),
  connector
)

export default enhance(CoinFilter)
