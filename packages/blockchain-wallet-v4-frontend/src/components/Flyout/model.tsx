import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import moment, { Moment } from 'moment'
import styled, { css } from 'styled-components'

import { fiatToString } from '@core/exchange/utils'
import {
  BeneficiaryType,
  BSBalancesType,
  BSPaymentMethodType,
  BSPaymentTypes,
  FiatType,
  NabuSymbolNumberType,
  WalletCurrencyType
} from '@core/types'
import { Icon, Image, Link, Text } from 'blockchain-info-components'
import {
  Content,
  DisplayContainer,
  DisplayIcon,
  DisplayPaymentIcon,
  MultiRowContainer
} from 'components/BuySell'
import { GreyCartridge, OrangeCartridge, SuccessCartridge } from 'components/Cartridge'
import CoinDisplay from 'components/Display/CoinDisplay'
import { CARD_TYPES, DEFAULT_CARD_SVG_LOGO } from 'components/Form/CreditCardBox/model'
import { convertBaseToStandard } from 'data/components/exchange/services'
import {
  ActionEnum,
  BankDetails,
  BankStatusType,
  BankTransferAccountType,
  BrokerageOrderType,
  RecurringBuyPeriods
} from 'data/types'
import { formatTextAmount } from 'services/forms'
import { getBankLogoImageName } from 'services/images'

const RECURRING_BUY_PERIOD_FETCH = 'RECURRING_BUY_PERIOD_FETCH'

type PaymentContainerProps = {
  disabled?: boolean
  isMethod: boolean
}

const Title = styled(Text)<{ asValue?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.grey900};
  margin-top: ${(props) => (props.asValue ? '4px' : '0px')};
`

const Row = styled.div`
  padding: 16px 40px;
  box-sizing: border-box;
  border-top: 1px solid ${(props) => props.theme.grey000};
  &:last-child {
    border-bottom: 1px solid ${(props) => props.theme.grey000};
  }
`
const Col = styled.div`
  display: flex;
  align-items: center;
`
const Value = styled(Text)<{ asTitle?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.grey800};
  margin-top: ${(props) => (props.asTitle ? '0px' : '4px')};
`

const DisablableIcon = styled(Icon)<{
  disabled?: boolean
}>`
  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`

const getAddBankStatusText = (bankStatus: BankStatusType) => {
  let image: string
  let title: React.ReactNode
  let text: React.ReactNode
  switch (bankStatus) {
    case BankStatusType.BANK_TRANSFER_ACCOUNT_EXPIRED:
    case BankStatusType.BANK_TRANSFER_ACCOUNT_REJECTED:
      image = 'bank-rejected'
      break
    case BankStatusType.ACTIVE:
      image = 'bank-success'
      break
    default:
      image = 'bank-error'
      break
  }
  switch (bankStatus) {
    case BankStatusType.BANK_TRANSFER_ACCOUNT_ALREADY_LINKED:
      title = (
        <FormattedMessage
          id='copy.bank_linked_error_title_already_linked'
          defaultMessage='This account is already linked.'
        />
      )
      break
    case BankStatusType.ACTIVE:
      title = <FormattedMessage id='copy.bank_linked.title' defaultMessage='Bank Linked!' />
      break
    case BankStatusType.BANK_TRANSFER_ACCOUNT_NOT_SUPPORTED:
    case BankStatusType.BANK_TRANSFER_ACCOUNT_INVALID:
      title = (
        <FormattedMessage
          id='copy.bank_link_current_account'
          defaultMessage='Please link a Current Account.'
        />
      )
      break
    case BankStatusType.BANK_TRANSFER_ACCOUNT_INFO_NOT_FOUND:
    case BankStatusType.BANK_TRANSFER_ACCOUNT_REJECTED_FRAUD:
    case BankStatusType.BANK_TRANSFER_ACCOUNT_FAILED_INTERNAL:
    case BankStatusType.BANK_TRANSFER_ACCOUNT_FAILED:
      title = (
        <FormattedMessage
          id='copy.bank_linked_error_title_rejected_fraud'
          defaultMessage='There was a problem linking your account.'
        />
      )
      break
    case BankStatusType.BANK_TRANSFER_ACCOUNT_NAME_MISMATCH:
      title = (
        <FormattedMessage
          id='copy.bank_linked_error_title_yourbank'
          defaultMessage='Is this your bank?'
        />
      )
      break
    case BankStatusType.BANK_TRANSFER_ACCOUNT_EXPIRED:
      title = (
        <FormattedMessage
          id='copy.bank_linked_error_title_expiredaccount'
          defaultMessage='We were unable to link your account.'
        />
      )
      break
    case BankStatusType.BANK_TRANSFER_ACCOUNT_REJECTED:
      title = (
        <FormattedMessage
          id='copy.bank_linked_error_title_connectionrejected'
          defaultMessage='Connection Rejected'
        />
      )
      break
    default:
      title = (
        <FormattedMessage
          id='scenes.exchange.confirm.oopsheader'
          defaultMessage='Oops! Something went wrong.'
        />
      )
      break
  }
  switch (bankStatus) {
    case BankStatusType.BANK_TRANSFER_ACCOUNT_ALREADY_LINKED:
      text = (
        <FormattedMessage
          id='copy.bank_linked_error_alreadylinked1'
          defaultMessage='We noticed this account is already linked to your Blockchain.com account.'
        />
      )
      break
    case BankStatusType.ACTIVE:
      text = (
        <FormattedMessage
          id='copy.bank_linked'
          defaultMessage='Your bank account is now linked to your Blockchain.com Wallet'
        />
      )
      break
    case BankStatusType.BANK_TRANSFER_ACCOUNT_NOT_SUPPORTED:
    case BankStatusType.BANK_TRANSFER_ACCOUNT_INVALID:
      text = (
        <FormattedMessage
          id='copy.bank_link_current_account_extra_fees'
          defaultMessage='Your bank may charge you extra fees if you buy crypto without a current account.'
        />
      )
      break
    case BankStatusType.BANK_TRANSFER_ACCOUNT_NAME_MISMATCH:
      text = (
        <>
          <FormattedMessage
            id='copy.bank_linked_error_yourbank'
            defaultMessage='We noticed the names don’t match. The bank you link must have a matching legal first & last name as your Blockchain.com Account.'
          />{' '}
          <Link
            size='16px'
            weight={500}
            target='_blank'
            href='https://support.blockchain.com/hc/en-us/'
          >
            <FormattedMessage id='buttons.learn_more_arrow' defaultMessage='Learn more ->' />
          </Link>
        </>
      )
      break
    case BankStatusType.BANK_TRANSFER_ACCOUNT_EXPIRED:
      text = (
        <FormattedMessage
          id='copy.bank_linked_error_title_expiredaccount.desc'
          defaultMessage='Please try connecting that bank account again or link any Visa or Mastercard'
        />
      )
      break
    case BankStatusType.BANK_TRANSFER_ACCOUNT_INFO_NOT_FOUND:
    case BankStatusType.BANK_TRANSFER_ACCOUNT_REJECTED_FRAUD:
    case BankStatusType.BANK_TRANSFER_ACCOUNT_FAILED_INTERNAL:
    case BankStatusType.BANK_TRANSFER_ACCOUNT_FAILED:
      text = (
        <>
          <FormattedMessage
            id='copy.bank_linked_error_rejected_fraud'
            defaultMessage='Please try again or select a different payment method.'
          />
        </>
      )
      break
    case BankStatusType.BANK_TRANSFER_ACCOUNT_REJECTED:
      text = (
        <>
          <FormattedMessage
            id='copy.bank_linked_error_account_rejected'
            defaultMessage="We believe you have declined linking your account. If this isn't correct, please"
          />{' '}
          <Link
            size='16px'
            weight={500}
            target='_blank'
            href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000190032'
          >
            <FormattedMessage id='copy.contact_support' defaultMessage='Contact Support' />
          </Link>
          .
        </>
      )
      break
    default:
      text = (
        <>
          <FormattedMessage
            id='copy.bank_linked_error'
            defaultMessage='Please try linking your bank again. If this keeps happening, please'
          />{' '}
          <Link
            size='16px'
            weight={500}
            target='_blank'
            href='https://support.blockchain.com/hc/en-us/'
          >
            <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
          </Link>
          .
        </>
      )
      break
  }
  return { image, text, title }
}

const getDefaultMethod = (defaultMethod, bankAccounts: BankTransferAccountType[]) => {
  if (defaultMethod) {
    return { ...defaultMethod, type: BSPaymentTypes.BANK_TRANSFER }
  }
  if (bankAccounts.length === 1) {
    return { ...bankAccounts[0], type: BSPaymentTypes.BANK_TRANSFER }
  }
}

const getPeriodTitleText = (period: RecurringBuyPeriods): React.ReactNode => {
  let text
  switch (period) {
    default:
    case RecurringBuyPeriods.ONE_TIME:
      text = (
        <FormattedMessage
          id='modals.recurringbuys.time_options.one_time'
          defaultMessage='One Time'
        />
      )
      break
    case RecurringBuyPeriods.DAILY:
      text = (
        <FormattedMessage id='modals.recurringbuys.time_options.daily' defaultMessage='Daily' />
      )
      break
    case RecurringBuyPeriods.WEEKLY:
      text = (
        <FormattedMessage id='modals.recurringbuys.time_options.weekly' defaultMessage='Weekly' />
      )
      break
    case RecurringBuyPeriods.BI_WEEKLY:
      text = (
        <FormattedMessage
          id='modals.recurringbuys.time_options.bi_weekly'
          defaultMessage='Twice a Month'
        />
      )
      break
    case RecurringBuyPeriods.MONTHLY:
      text = (
        <FormattedMessage id='modals.recurringbuys.time_options.monthly' defaultMessage='Monthly' />
      )
      break
  }
  return text
}

const getPeriodSubTitleText = (
  period: RecurringBuyPeriods,
  date: string | number = Date.now()
): React.ReactNode => {
  let text
  const startDate = moment(date)
  switch (period) {
    default:
    case RecurringBuyPeriods.DAILY:
      text = <></>
      break
    case RecurringBuyPeriods.WEEKLY:
      text = <>On {startDate.format('dddd')}s</>
      break
    case RecurringBuyPeriods.BI_WEEKLY:
      text = (
        <>
          On the {startDate.format('Do')} and {startDate.add(2, 'weeks').format('Do')}
        </>
      )
      break
    case RecurringBuyPeriods.MONTHLY:
      text = <>On the {startDate.format('Do')}</>
      break
  }
  return text
}

const getPeriodForSuccess = (
  period: RecurringBuyPeriods,
  date: string | number = Date.now()
): React.ReactNode => {
  let text
  const startDate = moment(date)
  switch (period) {
    default:
    case RecurringBuyPeriods.DAILY:
      text = <>every day</>
      break
    case RecurringBuyPeriods.WEEKLY:
      text = <>every {startDate.format('dddd')}</>
      break
    case RecurringBuyPeriods.BI_WEEKLY:
      text = (
        <span style={{ textTransform: 'lowercase' }}>
          {getPeriodSubTitleText(period, date)} of each month
        </span>
      )
      break
    case RecurringBuyPeriods.MONTHLY:
      text = (
        <span style={{ textTransform: 'lowercase' }}>{getPeriodSubTitleText(period, date)}</span>
      )
      break
  }
  return text
}

const getPeriodText = (period: RecurringBuyPeriods): React.ReactNode => {
  let text
  switch (period) {
    default:
    case RecurringBuyPeriods.DAILY:
      text = (
        <FormattedMessage
          id='modals.recurringbuys.timeframe.every_day'
          defaultMessage='Every day'
        />
      )
      break
    case RecurringBuyPeriods.WEEKLY:
      text = <FormattedMessage id='copy.once_a_week' defaultMessage='Once a Week' />
      break
    case RecurringBuyPeriods.BI_WEEKLY:
      text = <FormattedMessage id='copy.twice_a_month' defaultMessage='Twice a Month' />
      break
    case RecurringBuyPeriods.MONTHLY:
      text = <FormattedMessage id='copy.once_a_month' defaultMessage='Once a Month' />
      break
  }
  return text
}

const getActionText = (action: ActionEnum, nextDate: string | number) => {
  let text
  let isToday = false
  let date: Moment | string = moment()

  if (nextDate) {
    isToday = moment(nextDate).calendar().startsWith('Today')
    date = moment(nextDate)
  }

  date = date.format('ddd, MMMM Do')

  switch (action) {
    default:
    case ActionEnum.BUY:
      text = isToday ? (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_buy_is_today'
          defaultMessage='Next Buy is Today'
        />
      ) : (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_buy_on_date'
          defaultMessage='Next Buy on {date}'
          values={{ date }}
        />
      )
      break
    case ActionEnum.SELL:
      text = (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_sell_on_date'
          defaultMessage='Next Sell on {date}'
          values={{ date }}
        />
      )
      break
    case ActionEnum.DEPOSIT:
      text = (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_deposit_on_date'
          defaultMessage='Next Deposit on {date}'
          values={{ date }}
        />
      )
      break
    case ActionEnum.WITHDRAWAL:
      text = (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_withdrawal_on_date'
          defaultMessage='Next Withdrawal on {date}'
          values={{ date }}
        />
      )
      break
    case ActionEnum.SWAP:
      text = (
        <FormattedMessage
          id='scenes.coin.recurringbuy.next_swap_on_date'
          defaultMessage='Next Swap on {date}'
          values={{ date }}
        />
      )
      break
  }
  return text
}

const getPaymentMethodText = (paymentMethod: BSPaymentTypes) => {
  let text
  switch (paymentMethod) {
    case BSPaymentTypes.BANK_TRANSFER:
    case BSPaymentTypes.LINK_BANK:
    case BSPaymentTypes.BANK_ACCOUNT:
      text = <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />
      break
    case BSPaymentTypes.FUNDS:
      text = <FormattedMessage id='copy.wallet_funds' defaultMessage='Wallet Funds' />
      break
    case BSPaymentTypes.PAYMENT_CARD:
    case BSPaymentTypes.USER_CARD:
      text = <FormattedMessage id='simplebuy.confirm.payment_card' defaultMessage='Credit Card' />
      break
    default:
      text = <>{paymentMethod}</>
      break
  }
  return text
}

const availableMethodsToolTip = (methods: BSPaymentTypes[]) => {
  const methodsText = methods.map((method, i, methodArray) => {
    return (
      <>
        {getPaymentMethodText(method)}
        {i + 1 === methodArray.length ? '' : ', '}
      </>
    )
  })
  return (
    <FormattedMessage
      id='modals.recurringbuys.available_methods_tool_tip'
      defaultMessage='Recurring Buys are only available for these methods at this time: {methods}'
      values={{ methods: methodsText }}
    />
  )
}

const PaymentText = styled(Text)<PaymentContainerProps>`
  flex: 1;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  ${(props) =>
    !props.isMethod &&
    css`
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 35px;
    `}
`
const PaymentArrowContainer = styled.div<{
  disabled?: boolean
}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${(props) =>
    props.disabled &&
    css`
      cursor: not-allowed;
    `}
`
const DisplayTitle = styled(Title)`
  margin-top: 4px;
  text-transform: capitalize;
  color: ${(p) => p.theme.grey600};
  font-weight: 500;
  font-size: 14px;
`
const SectionTitle = styled(Text)`
  margin-top: 4px;
  padding: 5px 0;
`
const DisplayValue = styled(Value)`
  margin-top: 0;
`

const renderBankText = (
  value: BSPaymentMethodType | BankTransferAccountType | BeneficiaryType
): string | ReactElement => {
  if ('agent' in value) {
    // BeneficiaryType
    return value.name
  }
  if ('details' in value && value.details?.bankName) {
    // BankTransferAccountType | BSPaymentMethodType
    return value.details.bankName ? value.details.bankName : value.details?.accountNumber
  }
  return <FormattedMessage id='copy.bank_account' defaultMessage='Bank Account' />
}

const renderBankFullName = (
  method?: BSPaymentMethodType | BankTransferAccountType | BeneficiaryType
): string => {
  if (method) {
    if ('agent' in method) {
      // BeneficiaryType
      return method.name
    }
    if ('details' in method && method.details?.bankName) {
      // BankTransferAccountType | BSPaymentMethodType
      return method.details.bankName ? method.details.bankName : method.details?.accountNumber
    }
  }
  return ''
}

const renderBankSubText = (
  value: BSPaymentMethodType | BankTransferAccountType | BeneficiaryType
): string | ReactElement => {
  if ('agent' in value) {
    // BeneficiaryType
    return value.address
  }
  if ('details' in value && value.details?.bankAccountType) {
    // BankTransferAccountType | BSPaymentMethodType
    return `${value.details?.bankAccountType?.toLowerCase() || ''} account ${
      value.details?.accountNumber || ''
    }`
  }
  return <></>
}

const renderBank = (value: BSPaymentMethodType | BankTransferAccountType | BeneficiaryType) => (
  <>
    <DisplayValue>{renderBankText(value)}</DisplayValue>
    <DisplayTitle>{renderBankSubText(value)}</DisplayTitle>
  </>
)

const renderCardText = (value: BSPaymentMethodType): string => {
  return value.card
    ? value.card.label
      ? value.card.label.toLowerCase()
      : value.card.type
    : 'Credit or Debit Card'
}

const renderCard = (value: BSPaymentMethodType) => (
  <>
    <DisplayValue capitalize>{renderCardText(value)}</DisplayValue>
    <DisplayTitle>
      {value.card ? (
        <FormattedMessage
          id='modals.simplebuy.card_ending_in'
          defaultMessage='Card Ending in {lastFour}'
          values={{
            lastFour: value.card.number
          }}
        />
      ) : (
        <FormattedMessage id='modals.simplebuy.paymentcard' defaultMessage='Credit or Debit Card' />
      )}
    </DisplayTitle>
  </>
)

const renderFund = (value: BSPaymentMethodType, sbBalances: BSBalancesType) => (
  <>
    <DisplayValue>{value.currency}</DisplayValue>
    <DisplayTitle>
      {fiatToString({
        unit: value.currency as FiatType,
        value: convertBaseToStandard('FIAT', sbBalances[value.currency]?.available || '0')
      })}{' '}
      <FormattedMessage id='copy.available' defaultMessage='Available' />
    </DisplayTitle>
  </>
)

const getIcon = (
  method: BSPaymentMethodType | undefined,
  isSddFlow = false,
  disabled?: boolean
): ReactElement => {
  if (isSddFlow && !method) {
    return <DisablableIcon disabled={disabled} size='18px' color='blue600' name='credit-card-sb' />
  }
  if (!method) {
    return (
      <DisablableIcon
        cursor
        disabled={disabled}
        name='plus-in-circle-filled'
        size='22px'
        color='blue600'
      />
    )
  }

  switch (method.type) {
    case BSPaymentTypes.USER_CARD:
      const cardType = CARD_TYPES.find(
        (card) => card.type === (method.card ? method.card.type : '')
      )
      return (
        <img
          height='18px'
          width='auto'
          src={cardType ? cardType.logo : DEFAULT_CARD_SVG_LOGO}
          alt=''
        />
      )
    case BSPaymentTypes.FUNDS:
      return <Icon size='32px' color='USD' name={method.currency as WalletCurrencyType} />
    case BSPaymentTypes.BANK_TRANSFER:
      return <Image name={getBankLogoImageName(method.details?.bankName)} height='48px' />
    case BSPaymentTypes.BANK_ACCOUNT:
      return <Icon name='bank-filled' color='blue600' />

    default:
      return <></>
  }
}

const getBankText = (method?: BSPaymentMethodType | BankTransferAccountType | BeneficiaryType) => {
  if (!method) {
    return (
      <FormattedMessage
        id='modals.brokerage.add_a_bank_account'
        defaultMessage='Add a Bank Account'
      />
    )
  }
  return renderBank(method)
}

const getText = (
  method: BSPaymentMethodType | undefined,
  sbBalances: BSBalancesType,
  isSddFlow = false
): ReactElement => {
  if (isSddFlow && !method) {
    return (
      <Text weight={600} color='grey900' style={{ paddingBottom: '3px', paddingTop: '4px' }}>
        <FormattedMessage
          id='modals.simplebuy.confirm.credit_or_debit'
          defaultMessage='Credit or Debit Card'
        />
      </Text>
    )
  }
  if (!method) {
    return (
      <Text weight={600} color='grey900' style={{ paddingBottom: '3px', paddingTop: '4px' }}>
        <FormattedMessage
          id='modals.simplebuy.confirm.jump_to_payment'
          defaultMessage='Add Payment Method'
        />
      </Text>
    )
  }

  return method.type === BSPaymentTypes.USER_CARD
    ? renderCard(method)
    : method.type === BSPaymentTypes.BANK_TRANSFER
    ? renderBank(method)
    : renderFund(method, sbBalances)
}

const ActiveToggle = ({ isActive }: { isActive: boolean }): ReactElement => {
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

const DepositOrWithdrawal = (props: { fiatCurrency: FiatType; orderType: BrokerageOrderType }) => {
  return props.orderType === BrokerageOrderType.DEPOSIT ? (
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

type DepositBrokerageLimits = {
  orderType: BrokerageOrderType.DEPOSIT
  paymentMethod: BSPaymentMethodType
}
type WithdrawalBrokerageLimits = {
  fee?: string
  minWithdrawAmount?: string
  orderType: BrokerageOrderType.WITHDRAW
  withdrawableBalance?: string
}
const getBrokerageLimits = (props: DepositBrokerageLimits | WithdrawalBrokerageLimits) => {
  return props.orderType === BrokerageOrderType.DEPOSIT
    ? props.paymentMethod.limits
    : props.orderType === BrokerageOrderType.WITHDRAW &&
      props.withdrawableBalance &&
      props.minWithdrawAmount
    ? {
        max: (Number(props.withdrawableBalance) - Number(props.fee || '0')).toString(),
        min: props.minWithdrawAmount
      }
    : { max: '0', min: '0' }
}

const normalizeAmount = (value, prevValue) => {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(Number(value)) && value !== '.' && value !== '') return prevValue
  return formatTextAmount(value, true)
}

export {
  availableMethodsToolTip,
  Bank,
  BankWire,
  Col,
  DepositOrWithdrawal,
  DisplayTitle,
  DisplayValue,
  getActionText,
  getAddBankStatusText,
  getBankText,
  getBrokerageLimits,
  getDefaultMethod,
  getIcon,
  getPaymentMethodText,
  getPeriodForSuccess,
  getPeriodSubTitleText,
  getPeriodText,
  getPeriodTitleText,
  getText,
  normalizeAmount,
  PaymentArrowContainer,
  PaymentText,
  RECURRING_BUY_PERIOD_FETCH,
  renderBank,
  renderBankFullName,
  renderBankText,
  renderCard,
  renderCardText,
  renderFund,
  RightArrowIcon,
  Row,
  SectionTitle,
  Title,
  Value
}
