import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import moment from 'moment'
import {
  Banner,
  Text,
  TooltipIcon,
  TooltipHost
} from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import CoinDisplay from 'components/Display/CoinDisplay'
import ComboDisplay from 'components/Display/ComboDisplay'
import { FormattedMessage } from 'react-intl'
import Addresses from './Addresses'
import Description from './Description'
import Confirmations from './Confirmations'
import FiatAtTime from './FiatAtTime'
import Status from './Status'
import PartnerLabel from './PartnerLabel'
import media from 'services/ResponsiveService'
import { prop } from 'ramda'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'

const TransactionRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-shadow: none;
  padding: 25px 25px 0px 25px;
  box-sizing: border-box;
  transition: box-shadow 0.3s;
  &.active {
    box-shadow: 0px 5px 30px 0px rgba(0, 0, 0, 0.1);
  }
`
const TransactionRow = styled.div`
  width: 100%;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 25px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const DetailsRow = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 25px 0px;
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
  width: 33.333%;
  ${media.mobile`
    width: 50%;
  `};
`
const BannerWrapper = styled.div`
  margin-top: 5px;
`
const AddressesColumn = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  white-space: nowrap;
  width: 33.333%;

  @media (min-width: 992px) {
    display: flex;
  }
`
const AmountColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 33.333%;
  min-width: 200px;
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

const TransactionListItem = props => {
  const {
    coin,
    currency,
    isToggled,
    transaction,
    buysellPartner,
    ...rest
  } = props
  const { handleToggle, handleEditDescription } = rest
  return (
    <TransactionRowContainer className={isToggled ? 'active' : ''}>
      <TransactionRow onClick={() => handleToggle()}>
        <StatusColumn>
          <Status type={transaction.type} coin={coin} />
          <MediaContextConsumer>
            {({ mobile }) => (
              <Text size='14px' weight={300}>
                {dateHelper(prop('time', transaction) * 1000, mobile)}
              </Text>
            )}
          </MediaContextConsumer>
          {(transaction.fromWatchOnly || transaction.toWatchOnly) && (
            <BannerWrapper>
              <Banner type='informational'>
                <FormattedMessage
                  id='components.txlistitem.watchonly'
                  defaultMessage='Non-Spendable'
                />
              </Banner>
            </BannerWrapper>
          )}
          {prop('partnerLabel', transaction) ? (
            <PartnerLabel
              txType={prop('type', transaction)}
              partnerLabel={prop('partnerLabel', transaction)}
              buysellPartner={buysellPartner}
            />
          ) : null}
        </StatusColumn>
        <AddressesColumn>
          <Addresses
            to={transaction.to}
            from={transaction.from}
            inputs={transaction.inputs}
            outputs={transaction.outputs}
            coin={coin}
          />
        </AddressesColumn>
        <AmountColumn>
          <FiatDisplay
            coin={coin}
            size='14px'
            weight={400}
            style={{ marginBottom: '5px' }}
          >
            {transaction.amount}
          </FiatDisplay>
          <CoinDisplay coin={coin} size='14px' weight={300}>
            {transaction.amount}
          </CoinDisplay>
        </AmountColumn>
      </TransactionRow>
      {isToggled && (
        <DetailsRow>
          <DetailsColumn>
            <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
              <FormattedMessage
                id='components.txlistitem.description'
                defaultMessage='Description'
              />
            </Text>
            <Description
              value={transaction.description}
              handleEditDescription={handleEditDescription}
            />
            {coin === 'BTC' && (
              <React.Fragment>
                <Text
                  size='14px'
                  capitalize
                  weight={400}
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
          </DetailsColumn>
          {prop('inputs', transaction) &&
            prop('outputs', transaction) && (
              <DetailsColumn>
                <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
                  <FormattedMessage
                    id='components.txlistitem.sentfrom'
                    defaultMessage='Sent From'
                  />
                </Text>
                {prop('inputs', transaction).map(input => (
                  <Text size='14px' weight={300}>
                    {input.address}
                  </Text>
                ))}
                <Text
                  size='14px'
                  weight={400}
                  style={{ marginBottom: '5px', marginTop: '15px' }}
                >
                  <FormattedMessage
                    id='components.txlistitem.receivedby'
                    defaultMessage='Received By'
                  />
                </Text>
                {prop('outputs', transaction).map(output => (
                  <IOAddressText size='14px' weight={300}>
                    {output.address}
                    {output.change && (
                      <React.Fragment>
                        <span>&nbsp;</span>
                        <FormattedMessage
                          id='components.txlistitem.change'
                          defaultMessage='(Change Address)'
                        />
                        <TooltipHost id='txlist.change.tooltip'>
                          <TooltipIcon name='question-in-circle' />
                        </TooltipHost>
                      </React.Fragment>
                    )}
                  </IOAddressText>
                ))}
              </DetailsColumn>
            )}
          <DetailsColumn>
            <Text size='14px' weight={400} style={{ marginBottom: '5px' }}>
              <FormattedMessage
                id='components.txlistitem.status'
                defaultMessage='Status'
              />
            </Text>
            <Confirmations
              coin={coin}
              hash={transaction.hash}
              confirmations={transaction.confirmations}
            />
            {transaction.type !== 'received' && (
              <React.Fragment>
                <Text
                  size='14px'
                  weight={400}
                  style={{ marginBottom: '5px', marginTop: '15px' }}
                >
                  <FormattedMessage
                    id='scenes.transactions.bitcoin.content.pages.listitem.fee.label'
                    defaultMessage='Transaction Fee'
                  />
                </Text>
                <ComboDisplay coin={coin} size='14px' weight={300}>
                  {transaction.fee}
                </ComboDisplay>
              </React.Fragment>
            )}
          </DetailsColumn>
        </DetailsRow>
      )}
    </TransactionRowContainer>
  )
}

TransactionListItem.propTypes = {
  coin: PropTypes.string.isRequired,
  transaction: PropTypes.shape({
    type: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    to: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    initial_value: PropTypes.string,
    fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
}

export default TransactionListItem
