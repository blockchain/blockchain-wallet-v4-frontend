import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  BoxContainer,
  BoxRow,
  BoxRowItemSubTitle,
  BoxRowItemTitle,
  BoxRowWithBorder
} from '../CardDashboard.model'

const TransactionsBox = () => (
  <BoxContainer width='662px'>
    <BoxRowWithBorder>
      <BoxRowItemTitle>
        <FormattedMessage
          id='scenes.debit_card.dashboard.transactions.title'
          defaultMessage='Recent Transactions'
        />
      </BoxRowItemTitle>
    </BoxRowWithBorder>
    <BoxRow>
      <BoxRowItemSubTitle style={{ margin: 'auto' }}>
        <FormattedMessage
          id='scenes.debit_card.dashboard.transactions.empty_state'
          defaultMessage='Your most recent purchases will show up here'
        />
      </BoxRowItemSubTitle>
    </BoxRow>
  </BoxContainer>
)

export default TransactionsBox
