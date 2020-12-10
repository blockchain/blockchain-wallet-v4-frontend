import { DisplayContainer } from 'components/SimpleBuy'
import React from 'react'
import styled from 'styled-components'

const BankName = styled.div`
  font-weight: 600;
`

const BankDetails = styled.div`
  text-transform: capitalize;
`

type Props = {
  accountNumber: string,
  bankAccountType: string
  bankName: string
}

const Bank: React.FC<Props> = ({
  bankName,
  bankAccountType,
  accountNumber
}) => (
  <DisplayContainer data-e2e={`sbbankaccount`} role='button' onClick={() => {}}>
    <BankName>{bankName}</BankName>
    <BankDetails>
      {`${bankAccountType.toLowerCase()} Account ${accountNumber.replace(
        /x/g,
        ''
      )}`}
    </BankDetails>
  </DisplayContainer>
)

export default Bank
