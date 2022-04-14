import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Link, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import { BannerButton, IconWrapper } from '../styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${(props) => props.theme.grey000};
  border-radius: 8px;
  padding: 20px;

  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
    flex-direction: column;
  `}
`
const Row = styled.div`
  display: flex;
  align-items: center;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;

  & > div:first-child {
    margin-bottom: 4px;
  }
`
const PendingIconWrapper = styled(IconWrapper)`
  background-color: ${(props) => props.theme.blue100};
`
const Copy = styled(Text)`
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 12px;
`

class StxAirdropFundsAvailable extends PureComponent {
  render() {
    return (
      <Wrapper>
        <Row>
          <PendingIconWrapper>
            <Icon name='STX' size='30px' />
          </PendingIconWrapper>
          <Column>
            <Text size='20px' weight={600} color='grey800'>
              <FormattedMessage
                id='copy.stx_airdrop_avail'
                defaultMessage='STX Airdrop is Available'
              />
            </Text>
            <Copy size='16px' color='grey600' weight={500}>
              <FormattedMessage
                id='copy.stx_supported_added'
                defaultMessage='STX support has been added to the Blockchain.com Web Wallet. You can now send any STX received via the airdrop.'
              />
            </Copy>
          </Column>
        </Row>
        <Link
          href='https://blockchain.zendesk.com/hc/en-us/articles/4672971270556'
          target='_blank'
          rel='noopener noreferrer'
        >
          <BannerButton jumbo data-e2e='goToSupportStx' nature='primary'>
            <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
          </BannerButton>
        </Link>
      </Wrapper>
    )
  }
}

export default StxAirdropFundsAvailable
