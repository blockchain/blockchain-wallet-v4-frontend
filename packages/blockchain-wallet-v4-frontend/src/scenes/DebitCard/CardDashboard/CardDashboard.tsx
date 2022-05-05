import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BoxContainer } from './CardDashboard.model'
import ManageCardBox from './ManageCardBox'

const Iframe = styled.iframe`
  border: 0;
  width: 340px;
  height: 220px;
`

const CardDashboard = ({
  alertActions,
  cardToken,
  cards,
  debitCardActions,
  domains,
  last4,
  lockHandler,
  modalActions
}) => {
  const [some, setSome] = useState(false)
  const func = (value) => {
    setSome(value)
    if (value) setSome(value)
  }
  return (
    <div>
      <BoxContainer>
        <Iframe
          id='marqeta-card-iframe'
          src={`${domains.walletHelper}/wallet-helper/marqeta-card/#/${cardToken}/${last4}`}
        />
        <div>
          <FormattedMessage
            id='scenes.debit_card.dashboard.cards_title'
            defaultMessage='My Cards'
            onChange={func}
          />
        </div>
      </BoxContainer>
      <ManageCardBox
        alertActions={alertActions}
        modalActions={modalActions}
        debitCardActions={debitCardActions}
        cards={cards}
        lockHandler={lockHandler}
      />
    </div>
  )
}

export default CardDashboard
