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

const RawApplePayIcon = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='165.52107px'
    height='105.9651px'
    viewBox='0 0 165.52107 105.9651'
    {...props}
  >
    <g>
      <path d='M150.69807,0H14.82318c-0.5659,0-1.1328,0-1.69769,0.0033c-0.47751,0.0034-0.95391,0.0087-1.43031,0.0217 c-1.039,0.0281-2.0869,0.0894-3.1129,0.2738c-1.0424,0.1876-2.0124,0.4936-2.9587,0.9754 c-0.9303,0.4731-1.782,1.0919-2.52009,1.8303c-0.73841,0.7384-1.35721,1.5887-1.83021,2.52 c-0.4819,0.9463-0.7881,1.9166-0.9744,2.9598c-0.18539,1.0263-0.2471,2.074-0.2751,3.1119 c-0.0128,0.4764-0.01829,0.9528-0.0214,1.4291c-0.0033,0.5661-0.0022,1.1318-0.0022,1.6989V91.142 c0,0.5671-0.0011,1.13181,0.0022,1.69901c0.00311,0.4763,0.0086,0.9527,0.0214,1.4291 c0.028,1.03699,0.08971,2.08469,0.2751,3.11069c0.1863,1.0436,0.4925,2.0135,0.9744,2.9599 c0.473,0.9313,1.0918,1.7827,1.83021,2.52c0.73809,0.7396,1.58979,1.3583,2.52009,1.8302 c0.9463,0.4831,1.9163,0.7892,2.9587,0.9767c1.026,0.1832,2.0739,0.2456,3.1129,0.2737c0.4764,0.0108,0.9528,0.0172,1.43031,0.0194 c0.56489,0.0044,1.13179,0.0044,1.69769,0.0044h135.87489c0.5649,0,1.13181,0,1.69659-0.0044 c0.47641-0.0022,0.95282-0.0086,1.4314-0.0194c1.0368-0.0281,2.0845-0.0905,3.11301-0.2737 c1.041-0.1875,2.0112-0.4936,2.9576-0.9767c0.9313-0.4719,1.7805-1.0906,2.52011-1.8302c0.7372-0.7373,1.35599-1.5887,1.8302-2.52 c0.48299-0.9464,0.78889-1.9163,0.97429-2.9599c0.1855-1.026,0.2457-2.0737,0.2738-3.11069 c0.013-0.4764,0.01941-0.9528,0.02161-1.4291c0.00439-0.5672,0.00439-1.1319,0.00439-1.69901V14.8242 c0-0.5671,0-1.1328-0.00439-1.6989c-0.0022-0.4763-0.00861-0.9527-0.02161-1.4291c-0.02811-1.0379-0.0883-2.0856-0.2738-3.1119 c-0.18539-1.0432-0.4913-2.0135-0.97429-2.9598c-0.47421-0.9313-1.093-1.7816-1.8302-2.52 c-0.73961-0.7384-1.58881-1.3572-2.52011-1.8303c-0.9464-0.4818-1.9166-0.7878-2.9576-0.9754 c-1.0285-0.1844-2.0762-0.2457-3.11301-0.2738c-0.47858-0.013-0.95499-0.0183-1.4314-0.0217C151.82988,0,151.26297,0,150.69807,0 L150.69807,0z' />
      <path
        fill='#FFFFFF'
        d='M150.69807,3.532l1.67149,0.0032c0.4528,0.0032,0.90561,0.0081,1.36092,0.0205 c0.79201,0.0214,1.71849,0.0643,2.58209,0.2191c0.7507,0.1352,1.38029,0.3408,1.9845,0.6484 c0.5965,0.3031,1.14301,0.7003,1.62019,1.1768c0.479,0.4797,0.87671,1.0271,1.18381,1.6302 c0.30589,0.5995,0.51019,1.2261,0.64459,1.9823c0.1544,0.8542,0.1971,1.7832,0.21881,2.5801 c0.01219,0.4498,0.01819,0.8996,0.0204,1.3601c0.00429,0.5569,0.0042,1.1135,0.0042,1.6715V91.142 c0,0.558,0.00009,1.1136-0.0043,1.6824c-0.00211,0.4497-0.0081,0.8995-0.0204,1.3501c-0.02161,0.7957-0.0643,1.7242-0.2206,2.5885 c-0.13251,0.7458-0.3367,1.3725-0.64429,1.975c-0.30621,0.6016-0.70331,1.1484-1.18022,1.6251 c-0.47989,0.48-1.0246,0.876-1.62819,1.1819c-0.5997,0.3061-1.22821,0.51151-1.97151,0.6453 c-0.88109,0.157-1.84639,0.2002-2.57339,0.2199c-0.4574,0.0103-0.9126,0.01649-1.37889,0.0187 c-0.55571,0.0043-1.1134,0.0042-1.6692,0.0042H14.82318c-0.0074,0-0.0146,0-0.0221,0c-0.5494,0-1.0999,0-1.6593-0.0043 c-0.4561-0.00211-0.9112-0.0082-1.3512-0.0182c-0.7436-0.0201-1.7095-0.0632-2.5834-0.2193 c-0.74969-0.1348-1.3782-0.3402-1.9858-0.6503c-0.59789-0.3032-1.1422-0.6988-1.6223-1.1797 c-0.4764-0.4756-0.8723-1.0207-1.1784-1.6232c-0.3064-0.6019-0.5114-1.2305-0.64619-1.9852 c-0.15581-0.8626-0.19861-1.7874-0.22-2.5777c-0.01221-0.4525-0.01731-0.9049-0.02021-1.3547l-0.0022-1.3279l0.0001-0.3506V14.8242 l-0.0001-0.3506l0.0021-1.3251c0.003-0.4525,0.0081-0.9049,0.02031-1.357c0.02139-0.7911,0.06419-1.7163,0.22129-2.5861 c0.1336-0.7479,0.3385-1.3765,0.6465-1.9814c0.3037-0.5979,0.7003-1.1437,1.17921-1.6225 c0.477-0.4772,1.02309-0.8739,1.62479-1.1799c0.6011-0.3061,1.2308-0.5116,1.9805-0.6465c0.8638-0.1552,1.7909-0.198,2.5849-0.2195 c0.4526-0.0123,0.9052-0.0172,1.3544-0.0203l1.6771-0.0033H150.69807'
      />
      <g>
        <g>
          <path d='M45.1862 35.64053c1.41724-1.77266 2.37897-4.15282 2.12532-6.58506-2.07464.10316-4.60634 1.36871-6.07207 3.14276-1.31607 1.5192-2.4809 3.99902-2.17723 6.3293C41.39111 38.72954 43.71785 37.36345 45.1862 35.64053M47.28506 38.98252c-3.38211-.20146-6.25773 1.91951-7.87286 1.91951-1.61602 0-4.08931-1.81799-6.76438-1.76899-3.48177.05114-6.71245 2.01976-8.4793 5.15079-3.63411 6.2636-.95904 15.55471 2.57494 20.65606 1.71618 2.5238 3.78447 5.30269 6.50976 5.20287 2.57494-.10104 3.58421-1.66732 6.71416-1.66732 3.12765 0 4.03679 1.66732 6.76252 1.61681 2.82665-.05054 4.59381-2.52506 6.30997-5.05132 1.96878-2.877 2.77473-5.65498 2.82542-5.80748-.0507-.05051-5.45058-2.12204-5.50065-8.33358-.05098-5.20101 4.23951-7.6749 4.44144-7.82832C52.3832 39.4881 48.5975 39.08404 47.28506 38.98252' />
        </g>
        <g>
          <path d='M76.73385 31.94381c7.35096 0 12.4697 5.06708 12.4697 12.44437 0 7.40363-5.22407 12.49704-12.65403 12.49704h-8.13892v12.94318h-5.88037v-37.8846H76.73385zM68.41059 51.9493h6.74732c5.11975 0 8.0336-2.75636 8.0336-7.53479 0-4.77792-2.91385-7.50845-8.00727-7.50845h-6.77365V51.9493zM90.73997 61.97864c0-4.8311 3.70182-7.79761 10.26583-8.16526l7.56061-.44614v-2.12639c0-3.07185-2.07423-4.90959-5.53905-4.90959-3.28251 0-5.33041 1.57492-5.82871 4.04313h-5.35574c.31499-4.98859 4.56777-8.66407 11.3941-8.66407 6.69466 0 10.97377 3.54432 10.97377 9.08388v19.03421h-5.43472v-4.54194h-.13065c-1.60125 3.07185-5.09341 5.01441-8.71623 5.01441C94.52078 70.30088 90.73997 66.94038 90.73997 61.97864zM108.56641 59.4846v-2.17905l-6.8.41981c-3.38683.23649-5.30306 1.73291-5.30306 4.09579 0 2.41504 1.99523 3.99046 5.04075 3.99046C105.46823 65.81161 108.56641 63.08108 108.56641 59.4846zM119.34167 79.9889v-4.5946c.4193.10483 1.36425.10483 1.83723.10483 2.6252 0 4.04313-1.10245 4.90908-3.9378 0-.05267.49931-1.68025.49931-1.70658l-9.97616-27.64562h6.14268l6.98432 22.47371h.10432l6.98433-22.47371h5.9857l-10.34483 29.06304c-2.36186 6.69517-5.0924 8.84789-10.81577 8.84789C121.17891 80.12006 119.76098 80.06739 119.34167 79.9889z' />
        </g>
      </g>
    </g>
  </svg>
)

const ApplePayIcon = styled(RawApplePayIcon)`
  height: 18px;
  display: block;
`

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
