import { connect } from 'react-redux'
import { equals } from 'ramda'
import { ExchangeText, Note } from 'components/Exchange'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { Icon, Image, Link, Text } from 'blockchain-info-components'
import { Row } from '../Layout'
import React from 'react'
import styled from 'styled-components'

const InfoRow = styled(Row)`
  padding: 16px 4px;
`
const InfoLink = styled(Link)`
  display: inline-block;
`
const InfoIcon = styled(Icon)`
  display: inline-block;
  transform: rotate(270deg);
  margin-left: 4px;
  font-size: 10px;
  font-weight: 800;
`
const InfoImage = styled(Image)`
  height: 40px;
  padding-bottom: 8px;
  margin-right: 16px;
`

const Notifications = ({
  showRejectedNotification,
  sourceCoin,
  targetCoin
}) => {
  const showPaxWarning = equals('PAX', sourceCoin) || equals('PAX', targetCoin)
  return (
    <React.Fragment>
      {showPaxWarning && (
        <Note>
          <FormattedMessage
            id='scenes.exchange.exchangeform.notifications.paxdisclaimer'
            defaultMessage='A Paxos USD token is not itself a US dollar, but Paxos Trust Company, LLC is responsible for backing every token with a US dollar held in segregated accounts at FDIC-insured, U.S. banks. Paxos Trust Company, LLC is also responsible for issuing and redeeming each token in exchange for $1.00.'
          />
          &nbsp;
          <InfoLink
            href='https://support.blockchain.com/hc/en-us/sections/360004368351-USD-Pax-FAQ'
            target='_blank'
          >
            <Text color='brand-secondary' size='12px' weight={300}>
              <FormattedMessage
                id='scenes.exchange.exchangeform.notifications.paxlearnmore'
                defaultMessage='Learn more'
              />
              <InfoIcon name='down-arrow-filled' color='brand-secondary' />
            </Text>
          </InfoLink>
        </Note>
      )}
      {showRejectedNotification && (
        <InfoRow>
          <InfoImage
            name='failed-kyc'
            srcset={{
              'failed-kyc2': '2x',
              'failed-kyc3': '3x'
            }}
          />
          <ExchangeText>
            <FormattedMessage
              id='scenes.exchange.exchangeform.notifications.kycrejected'
              defaultMessage='We had trouble approving your identity. Your Swap feature has been disabled at this time.'
            />
            &nbsp;
            <InfoLink
              href='https://support.blockchain.com/hc/en-us/articles/360018080352-Why-has-my-ID-submission-been-rejected-'
              target='_blank'
            >
              <ExchangeText color='brand-secondary'>
                <FormattedMessage
                  id='scenes.exchange.exchangeform.notifications.kyclearnmore'
                  defaultMessage='Learn more'
                />
                <InfoIcon name='down-arrow-filled' color='brand-secondary' />
              </ExchangeText>
            </InfoLink>
          </ExchangeText>
        </InfoRow>
      )}
    </React.Fragment>
  )
}

export default connect(getData)(Notifications)
