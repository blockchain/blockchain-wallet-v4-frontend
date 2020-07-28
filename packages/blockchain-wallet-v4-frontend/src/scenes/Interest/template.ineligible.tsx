import { FormattedMessage } from 'react-intl'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'

import { Props as OwnProps, SuccessStateType } from '.'

const AbsoluteWarning = styled(Text)`
  display: flex;
  align-items: center;
  left: 0;
  margin-bottom: 20px;
`

function IneligibiltyWarning (props: OwnProps & SuccessStateType): ReactElement {
  const { interestEligible, instruments } = props
  const ineligibilityReasonList = instruments.map(instrument => {
    return interestEligible[instrument]?.ineligibilityReason
  })
  return (
    <AbsoluteWarning size='12px' weight={500} color='grey600'>
      {ineligibilityReasonList.includes('REGION') && (
        <>
          <Icon name='info' color='grey600' style={{ marginRight: '8px' }} />
          <FormattedMessage
            id='scenes.interest.regionblocked'
            defaultMessage='Blockchain Interest Account is currently not available in your country or region for some or all cryptos.'
          />
          <Link
            size='12px'
            weight={500}
            target='_blank'
            href='https://blockchain.zendesk.com/hc/en-us/articles/360043221472'
            style={{ marginLeft: '4px' }}
          >
            <FormattedMessage
              id='buttons.learn_more'
              defaultMessage='Learn More'
            />
          </Link>
        </>
      )}
      {ineligibilityReasonList.includes('BLOCKED') && (
        <>
          <FormattedMessage
            id='scenes.interest.userblocked.bo'
            defaultMessage='Blockchain Interest Account is currently not available.'
          />{' '}
          <Link
            size='12px'
            weight={500}
            target='_blank'
            href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000190032'
          >
            <FormattedMessage
              id='buttons.contact_support'
              defaultMessage='Contact Support'
            />
          </Link>
        </>
      )}
    </AbsoluteWarning>
  )
}
export default IneligibiltyWarning
