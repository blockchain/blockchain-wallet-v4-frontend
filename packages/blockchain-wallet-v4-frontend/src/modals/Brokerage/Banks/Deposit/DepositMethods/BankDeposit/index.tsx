import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { BSPaymentMethodType } from '@core/types'
import { Icon } from 'blockchain-info-components'
import {
  Content,
  Description,
  DisplayContainer,
  DisplayIcon,
  DisplaySubTitle,
  DisplayTitle
} from 'components/BuySell'
import { SuccessCartridge } from 'components/Cartridge'

const DisplayTitleBank = styled(DisplayTitle)`
  margin-bottom: 2px;
`
const DisplayIconBank = styled(DisplayIcon)`
  min-height: 75px;
`
const CartridgeContainer = styled.div`
  display: flex;
  margin-top: 8px;
  align-items: center;
  padding-left: 45px;
`
const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const TopSection = styled.div`
  display: flex;
  flex-direction: row;
`

type Props = {
  icon: ReactElement
  onClick: (string) => void
  value: BSPaymentMethodType
}

const BankDeposit = ({ icon, onClick, value }: Props) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}LinkBank`}
    role='button'
    onClick={onClick}
  >
    <MainContent>
      <TopSection>
        <DisplayIconBank>{icon}</DisplayIconBank>
        <Content>
          <DisplayTitleBank>
            <FormattedMessage
              id='modals.simplebuy.easybanktransfer'
              defaultMessage='Easy Bank Transfer'
            />
          </DisplayTitleBank>
          <DisplaySubTitle>
            <FormattedMessage id='copy.instantly_available' defaultMessage='Instantly Available' />
          </DisplaySubTitle>
          <Description>
            <FormattedMessage
              id='modals.brokerage.bank_deposit_description'
              defaultMessage='Securely link a bank and send cash to your Blockchain.com Wallet at anytime.'
            />
          </Description>
        </Content>
        <Icon name='chevron-right' size='24px' color='grey400' />
      </TopSection>
      <CartridgeContainer>
        <SuccessCartridge>
          <FormattedMessage id='copy.most_popular' defaultMessage='Most Popular' />
        </SuccessCartridge>
      </CartridgeContainer>
    </MainContent>
  </DisplayContainer>
)

export default BankDeposit
