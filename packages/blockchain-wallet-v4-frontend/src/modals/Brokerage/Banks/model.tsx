import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled, { css } from 'styled-components'

import { Icon, Image } from 'blockchain-info-components'
import { BeneficiaryType, FiatType, NabuSymbolNumberType } from 'blockchain-wallet-v4/src/types'
import { GreyCartridge, OrangeCartridge, SuccessCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import { Col, Title, Value } from 'components/Flyout'
import {
  Content,
  DisplayContainer,
  DisplayIcon,
  DisplayPaymentIcon,
  MultiRowContainer
} from 'components/SimpleBuy'
import { BankDetails } from 'data/types'
import { formatTextAmount } from 'services/forms'

export const ActiveToggle = ({ isActive }: { isActive: boolean }): ReactElement => {
  return (
    <>
      {isActive ? (
        <Icon
          name='checkmark-circle-filled'
          size='24px'
          color='green600'
          role='button'
          style={{ justifyContent: 'flex-start' }}
        />
      ) : (
        <Image
          name='circle-empty'
          width='24px'
          height='24px'
          style={{ justifyContent: 'flex-start' }}
        />
      )}
    </>
  )
}

const RightArrowIcon = styled(Icon)<{
  disabled?: boolean
}>`
  transform: rotate(180deg);
  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`

const StyledTitle = styled(Title)`
  text-transform: capitalize;
  color: ${(p) => p.theme.grey600};
  font-weight: 500;
  font-size: 14px;
`

const StyledValue = styled(Value)`
  color: ${(p) => p.theme.grey900};
  font-weight: 600;
  font-size: 16px;
`

const CartridgeContainer = styled.div`
  display: flex;
  margin-top: 8px;
  align-items: center;
`

// I couldn't get {' '} to work to add space so I needed to add padding here
const StyledGreyCartridge = styled(GreyCartridge)`
  margin-right: 8px;

  & span:last-child {
    padding-left: 3px;
  }
`

type BankProps = {
  bankDetails: BankDetails
  icon: ReactElement
  isActive: boolean
  onClick: () => void
  text: string
}

const Bank = ({ bankDetails, icon, isActive, onClick, text }: BankProps) => (
  <DisplayContainer
    data-e2e={`sb${bankDetails?.bankAccountType?.toLowerCase()}Banks`}
    role='button'
    onClick={onClick}
  >
    <DisplayIcon>{icon}</DisplayIcon>
    <MultiRowContainer>
      <StyledValue asTitle>{text}</StyledValue>
      <StyledTitle asValue>
        {`${bankDetails?.bankAccountType?.toLowerCase() || ''} account ${
          bankDetails?.accountNumber || ''
        }`}
      </StyledTitle>
      <CartridgeContainer>
        <SuccessCartridge>
          <FormattedMessage id='modals.brokerage.free' defaultMessage='Free' />
        </SuccessCartridge>
      </CartridgeContainer>
    </MultiRowContainer>
    <ActiveToggle isActive={isActive} />
  </DisplayContainer>
)

type BankWireProps = {
  beneficiary: BeneficiaryType
  isActive?: boolean
  minAmount?: NabuSymbolNumberType
  onClick: () => void
  type: 'DEPOSIT' | 'WITHDRAWAL'
}

const BankWire = ({
  beneficiary,
  isActive = false,
  minAmount,
  onClick,
  type = 'WITHDRAWAL'
}: BankWireProps) => (
  <DisplayContainer onClick={onClick}>
    <Col>
      <DisplayPaymentIcon showBackground>
        <Icon name='bank-filled' color='blue600' size='16px' />
      </DisplayPaymentIcon>
    </Col>
    <Col style={{ width: '100%' }}>
      <Content>
        <Value asTitle>{beneficiary.name}</Value>
        <Title asValue>{beneficiary.agent.account}</Title>

        {type === 'DEPOSIT' && (
          <CartridgeContainer>
            {minAmount && (
              <StyledGreyCartridge>
                <CoinDisplay
                  size='14px'
                  marginRight='2px'
                  weight={600}
                  color='inherit'
                  coin={minAmount.symbol}
                >
                  {minAmount.value}
                </CoinDisplay>
                <FormattedMessage
                  id='modals.brokerage.min_withdrawal'
                  defaultMessage='Min Withdrawal'
                />
              </StyledGreyCartridge>
            )}
            <OrangeCartridge>
              <FormattedMessage id='modals.brokerage.wire_fee' defaultMessage='Wire Fee' />
            </OrangeCartridge>
          </CartridgeContainer>
        )}
      </Content>
    </Col>
    {type === 'DEPOSIT' ? (
      <RightArrowIcon cursor disabled={false} name='arrow-back' size='20px' color='grey600' />
    ) : (
      <ActiveToggle isActive={isActive} />
    )}
  </DisplayContainer>
)

const DepositOrWithdrawal = (props: {
  fiatCurrency: FiatType
  orderType: 'DEPOSIT' | 'WITHDRAWAL'
}) => {
  return props.orderType === 'DEPOSIT' ? (
    <FormattedMessage
      id='modals.brokerage.deposit_fiat'
      defaultMessage='Deposit {fiat}'
      values={{ fiat: props.fiatCurrency }}
    />
  ) : (
    <FormattedMessage
      id='modals.brokerage.withdraw_fiat'
      defaultMessage='Withdraw {fiat}'
      values={{ fiat: props.fiatCurrency }}
    />
  )
}

const normalizeAmount = (value, prevValue) => {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, true)
}

export { Bank, BankWire, DepositOrWithdrawal, normalizeAmount, RightArrowIcon }
