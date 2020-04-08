import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import {
  Banner,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import Addresses from './Addresses'
import CoinDisplay from 'components/Display/CoinDisplay'
import Confirmations from './Confirmations'
import Description from './Description'
import FiatAtTime from './FiatAtTime'
import FiatDisplay from 'components/Display/FiatDisplay'
import media from 'services/ResponsiveService'
import PartnerLabel from './PartnerLabel'
import Status from './Status'
import TransactionFee from './TransactionFee'

const TransactionRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-shadow: none;
  padding: 16px 16px 0;
  box-sizing: border-box;
  transition: box-shadow 0.3s;
  &.active {
    box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.1);
  }
`
const TransactionRow = styled.div`
  width: 100%;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.grey000};
`
const DetailsRow = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 25px 0;
`
const DetailsColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 33.333%;
  &:last-child {
    align-items: flex-end;
  }
`
const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 30%;
  ${media.mobile`
    width: 50%;
  `};
`
const BannerWrapper = styled.div`
  margin-top: 8px;
`
const AddressesColumn = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  white-space: nowrap;
  width: 50%;
  @media (min-width: 992px) {
    display: flex;
  }
`
const AmountColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 20%;
  align-items: flex-end;
  ${media.mobile`
    min-width: 50%;
  `};
`
const IOAddressText = styled(Text)`
  display: flex;
  align-items: center;
`

const dateHelper = (time, isMobile) =>
  moment(time)
    .local()
    .format(isMobile ? 'MM/DD/YY @ h:mm a' : 'MMMM D YYYY @ h:mm A')

const TransactionListItem = ({
  coin,
  coinTicker,
  currency,
  isToggled,
  transaction,
  buySellPartner,
  handleToggle,
  handleEditDescription,
  onViewTxDetails
}) => (
  <TransactionRowContainer
    className={isToggled ? 'active' : ''}
    data-e2e='transactionRow'
  >
    <TransactionRow onClick={() => handleToggle()}>
      <StatusColumn data-e2e='transactionDateColumn'>
        <Status type={transaction.type} coinTicker={coinTicker} />
        <MediaContextConsumer>
          {({ mobile }) => (
            <Text size='14px' weight={400} data-e2e='transactionDate'>
              {dateHelper(prop('time', transaction) * 1000, mobile)}
            </Text>
          )}
        </MediaContextConsumer>
        {(transaction.fromWatchOnly || transaction.toWatchOnly) && (
          <BannerWrapper>
            <Banner label='true' type='informational'>
              <FormattedMessage
                id='components.txlistitem.watchonly'
                defaultMessage='Non-Spendable'
              />
            </Banner>
          </BannerWrapper>
        )}
        {transaction.rbf && (
          <BannerWrapper>
            <Banner label='true' type='informational'>
              <FormattedMessage
                id='components.txlistitem.rbf'
                defaultMessage='Replace-By-Fee'
              />
            </Banner>
          </BannerWrapper>
        )}
        {transaction.erc20 && (
          <BannerWrapper>
            <Banner label='true' type='informational'>
              <FormattedMessage
                id='components.txlistitem.usddfee'
                defaultMessage='USD Digital Fee'
              />
            </Banner>
          </BannerWrapper>
        )}
        {prop('partnerLabel', transaction) ? (
          <PartnerLabel
            txType={prop('type', transaction)}
            partnerLabel={prop('partnerLabel', transaction)}
            buySellPartner={buySellPartner}
          />
        ) : null}
      </StatusColumn>
      <AddressesColumn data-e2e='transactionAddressesColumn'>
        <Addresses
          to={transaction.to}
          from={transaction.from}
          inputs={transaction.inputs}
          outputs={transaction.outputs}
          coin={coin}
        />
      </AddressesColumn>
      <AmountColumn data-e2e='transactionAmountColumn'>
        <FiatDisplay
          coin={coin}
          size='14px'
          weight={500}
          style={{ marginBottom: '5px' }}
        >
          {transaction.amount}
        </FiatDisplay>
        <CoinDisplay coin={coin} size='14px' weight={400}>
          {transaction.amount}
        </CoinDisplay>
      </AmountColumn>
    </TransactionRow>
    {isToggled && (
      <DetailsRow data-e2e='expandedTransactionRow'>
        <DetailsColumn data-e2e='descriptionTransactionColumn'>
          <Text size='14px' weight={500} style={{ marginBottom: '5px' }}>
            <FormattedMessage
              id='components.txlistitem.description'
              defaultMessage='Description'
            />
          </Text>
          <Description
            description={transaction.description}
            handleEditDescription={handleEditDescription}
          />
          {coin === 'BTC' && (
            <React.Fragment>
              <Text
                size='14px'
                capitalize
                weight={500}
                style={{ marginBottom: '5px', marginTop: '15px' }}
              >
                <FormattedMessage
                  id='components.txlistitem.valueattime'
                  defaultMessage='Value When {type}'
                  values={{ type: transaction.type }}
                />
              </Text>
              <FiatAtTime
                amount={transaction.amount}
                hash={transaction.hash}
                time={transaction.time}
                type={transaction.type}
                currency={currency}
              />
            </React.Fragment>
          )}
          {coin === 'XLM' && transaction.memo && (
            <React.Fragment>
              <Text
                size='14px'
                capitalize
                weight={500}
                style={{ marginBottom: '5px', marginTop: '15px' }}
              >
                <FormattedMessage
                  id='components.txlistitem.memo'
                  defaultMessage='Memo'
                />
                &nbsp;
                {transaction.memoType}
              </Text>
              <Text
                size='14px'
                capitalize
                weight={400}
                data-e2e='xlmTransactionMemo'
              >
                {transaction.memo}
              </Text>
            </React.Fragment>
          )}
        </DetailsColumn>
        {prop('inputs', transaction) && prop('outputs', transaction) && (
          <DetailsColumn data-e2e='sentFromTransactionColumn'>
            <Text size='14px' weight={500} style={{ marginBottom: '5px' }}>
              <FormattedMessage
                id='components.txlistitem.sentfrom'
                defaultMessage='Sent From'
              />
            </Text>
            {prop('inputs', transaction).map(input => (
              <Text size='14px' weight={400}>
                {input.address}
              </Text>
            ))}
            <Text
              size='14px'
              weight={500}
              style={{ marginBottom: '5px', marginTop: '15px' }}
            >
              <FormattedMessage
                id='components.txlistitem.receivedby'
                defaultMessage='Received By'
              />
            </Text>
            {prop('outputs', transaction).map(output => (
              <IOAddressText size='14px' weight={400}>
                {output.address}
                {output.change && (
                  <React.Fragment>
                    <span>&nbsp;</span>
                    <FormattedMessage
                      id='components.txlistitem.change'
                      defaultMessage='(Change Address)'
                    />
                    <TooltipHost id='txlist.change.tooltip'>
                      <TooltipIcon name='info' />
                    </TooltipHost>
                  </React.Fragment>
                )}
              </IOAddressText>
            ))}
          </DetailsColumn>
        )}
        <DetailsColumn data-e2e='statusTransactionColumn'>
          <Text size='14px' weight={500} style={{ marginBottom: '5px' }}>
            <FormattedMessage
              id='components.txlistitem.status'
              defaultMessage='Status'
            />
          </Text>
          <Confirmations
            coin={coin}
            hash={transaction.hash}
            txBlockHeight={transaction.blockHeight}
            onViewTxDetails={onViewTxDetails}
          />
          {transaction.type !== 'received' && (
            <TransactionFee
              coin={coin}
              feeR={transaction.fee}
              hash={transaction.hash}
            />
          )}
        </DetailsColumn>
      </DetailsRow>
    )}
  </TransactionRowContainer>
)

TransactionListItem.propTypes = {
  coin: PropTypes.string.isRequired,
  transaction: PropTypes.shape({
    type: PropTypes.string.isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    time: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    to: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    initial_value: PropTypes.string,
    fee: PropTypes.object
  })
}

export default TransactionListItem
