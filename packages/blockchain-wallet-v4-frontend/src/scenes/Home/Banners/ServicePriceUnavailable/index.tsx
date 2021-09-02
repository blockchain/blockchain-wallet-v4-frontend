import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  overflow: hidden;
  padding: 20px;

  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
  `}
`
const MessageWrapper = styled.div`
  display: flex;
  align-items: center;
`
const VerbText = styled(Text)`
  margin-right: 5px;
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => props.theme.black};
`

const Description = styled(Text)`
  margin-top: 2px;
  font-weight: 400;
  font-size: 14px;
  color: ${(props) => props.theme.black};
  display: none;

  ${media.atLeastMobile`
    display: block;
  `}
`

const ServicePriceUnavailable = () => {
  return (
    <Wrapper>
      <MessageWrapper>
        <Icon name='bell' color='red600' size='36px' style={{ marginRight: '16px' }} />
        <div>
          <VerbText>
            <FormattedMessage
              id='copy.rates_unavailable'
              defaultMessage='Pricing data is currently unavailable.'
            />
          </VerbText>
          <Description>
            <FormattedMessage
              id='copy.rates_unavailable.description_1'
              defaultMessage='When pricing data is missing we can not display accurate balance information. Rest assured our team is working on a solution and your funds are safe.'
            />
          </Description>
        </div>
      </MessageWrapper>
    </Wrapper>
  )
}

export default ServicePriceUnavailable
