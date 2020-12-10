import { DisplayContainer } from 'components/SimpleBuy'
import React from 'react'
import styled from 'styled-components'

import { SBPaymentMethodType } from 'core/types'

const BankName = styled.div`
  font-weight: 600;
`

const BankDetails = styled.div`
  text-transform: capitalize;
`

type Props = {
  onClick: () => void,
  text: string,
  value: SBPaymentMethodType
}

const Bank: React.FC<Props> = ({ text, value, onClick }) => (
  <DisplayContainer data-e2e={`sbbankaccount`} role='button' onClick={onClick}>
    <BankName>
      {text} {value.currency}
    </BankName>
    <BankDetails>
      {`${text.toLowerCase()} Account ${text.replace(/x/g, '')}`}
    </BankDetails>
  </DisplayContainer>
)

export default Bank
