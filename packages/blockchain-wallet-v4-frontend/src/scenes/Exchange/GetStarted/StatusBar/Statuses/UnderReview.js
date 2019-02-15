import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { FasExclamationCircle } from '@blockchain-com/components'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  background-color: #f5a623;
  border-radius: 4px;

  & > :not(:first-child) {
    margin-top: 8px;
  }

  @media (min-width: 960px) {
    width: 500px;
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  & > :not(:first-child) {
    margin-left: 8px;
  }
`
const Icon = styled(FasExclamationCircle).attrs({ size: '28px' })`
  fill: ${props => props.theme['white']};
`

export const UnderReview = () => (
  <Wrapper>
    <Row>
      <Icon />
      <Text color='white' size='14px' weight={400}>
        <FormattedMessage
          id='scenes.exchange.getstarted.status.underreview.title'
          defaultMessage='Account verification under review'
        />
      </Text>
    </Row>
    <Text size='14px' weight={300}>
      <FormattedMessage
        id='scenes.exchange.getstarted.status.underreview.description'
        defaultMessage='We had some trouble verifying your account with the documents provided. Our Support team will contact you shortly to help you with the verification process.'
      />
    </Text>
  </Wrapper>
)

export default UnderReview
