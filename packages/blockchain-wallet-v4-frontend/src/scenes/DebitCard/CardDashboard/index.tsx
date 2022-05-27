import React from 'react'
import styled from 'styled-components'

import ManageCardBox from './ManageCardBox'
import { BoxContainer } from './model'

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
  return (
    <div>
      <BoxContainer>
        <Iframe
          id='marqeta-card-iframe'
          src={`${domains.walletHelper}/wallet-helper/marqeta-card/#/${cardToken}/${last4}`}
        />
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
