import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import moment from 'moment'
import { Banner, Button, Text } from 'blockchain-info-components'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
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
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
  padding: 15px 30px;
  ${media.mobile`
    padding: 10px;
  `};
`
const TransactionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 15%;
  ${media.mobile`
    width: 28%;
  `};
`
const BannerWrapper = styled.div`
  margin-top: 5px;
`
const DetailsColumn = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  white-space: nowrap;
  width: 35%;

  @media (min-width: 992px) {
    display: flex;
  }
`
const ConfirmationColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 20%;

  @media (min-width: 1200px) {
    width: 15%;
  }
`
const AmountColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 20%;
  min-width: 200px;
  ${media.mobile`
    min-width: 170px;
  `};
`
const TransactionValues = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 8px;

  @media (min-width: 1200px) {
    width: auto;
  }
`
const ToggleButton = styled(Button)`
  align-self: flex-end;
  ${media.mobile`
    min-width: 120px;
  `};
`
const FeeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  > *:first-child {
    margin-right: 3px;
  }
  ${media.mobile`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const dateHelper = (time, isMobile) =>
  moment(time)
    .local()
    .format(isMobile ? 'MM/DD/YY @ h:mm a' : 'MMMM D YYYY @ h:mm A')

const TransactionListItem = props => {
  const {
    handleCoinToggle,
    transaction,
    handleEditDescription,
    coin,
    minConfirmations,
    buysellPartner
  } = props

  return (
    <TransactionRowContainer>
      <TransactionRow>
        <StatusColumn>
          <Status type={transaction.type} />
          <MediaContextConsumer>
            {({ mobile }) => (
              <Text size='13px' weight={300}>
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
        <DetailsColumn>
          <Addresses
            to={transaction.to}
            from={transaction.from}
            inputs={transaction.inputs}
            outputs={transaction.outputs}
            coin={coin}
          />
          <Description
            value={transaction.description}
            handleEditDescription={handleEditDescription}
          />
        </DetailsColumn>
        <ConfirmationColumn>
          <Confirmations
            coin={coin}
            confirmations={transaction.confirmations}
            minConfirmations={minConfirmations}
            hash={transaction.hash}
          />
        </ConfirmationColumn>
        <AmountColumn>
          <ToggleButton nature={transaction.type} onClick={handleCoinToggle}>
            <SwitchableDisplay
              mobileSize='12px'
              coin={coin}
              size='16px'
              weight={300}
              color='white'
              cursor='pointer'
            >
              {transaction.amount}
            </SwitchableDisplay>
          </ToggleButton>
          <TransactionValues>
            {coin === 'BTC' && (
              <FiatAtTime
                amount={transaction.amount}
                hash={transaction.hash}
                time={transaction.time}
                type={transaction.type}
              />
            )}
            {transaction.type !== 'received' && (
              <FeeWrapper>
                <Text size='12px' weight={300}>
                  <FormattedMessage
                    id='scenes.transactions.bitcoin.content.pages.listitem.fee.label'
                    defaultMessage='Transaction Fee: '
                  />
                </Text>
                <SwitchableDisplay coin={coin} size='12px' weight={200}>
                  {transaction.fee}
                </SwitchableDisplay>
              </FeeWrapper>
            )}
          </TransactionValues>
        </AmountColumn>
      </TransactionRow>
    </TransactionRowContainer>
  )
}

TransactionListItem.propTypes = {
  coin: PropTypes.string.isRequired,
  minConfirmations: PropTypes.number.isRequired,
  handleCoinToggle: PropTypes.func.isRequired,
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
