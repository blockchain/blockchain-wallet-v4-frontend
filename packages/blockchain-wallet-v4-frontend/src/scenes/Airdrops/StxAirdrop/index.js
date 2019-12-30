import { Box } from '../AirdropInfo'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Icon, Link, Text } from 'blockchain-info-components'
import { StxShare, StxStatus } from './model.tsx'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const Header = styled.div`
  display: flex;
  align-items: center;
`
const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 26px;
  min-height: 50px;
  > div {
    width: 50%;
  }
`
const Date = styled.div`
  height: 100%;
  padding-left: 20px;
  border-left: 1px solid ${props => props.theme['grey000']};

  > div:first-child {
    margin-bottom: 4px;
  }
`
const OverflowFooterText = styled(Text)`
  position: absolute;
  margin-left: -16px;
  bottom: -52px;
  line-height: 1.5;

  ${media.laptop`
    padding-bottom: 12px;
    bottom: -50px;
  `};
`

const StxAirdrop = props => {
  return (
    <Box>
      <div>
        <Header>
          <Icon name='stx' color='stx' size='32px' />
          <Text
            size='20px'
            color='grey800'
            weight={600}
            style={{ marginLeft: '16px' }}
          >
            <FormattedMessage
              id='scenes.airdrops.blockstack'
              defaultMessage='Blockstack'
            />
          </Text>
        </Header>
        <Text
          size='12px'
          color='grey600'
          weight={500}
          lineHeight='1.5'
          style={{ marginTop: '16px' }}
        >
          <FormattedHTMLMessage
            id='scenes.airdrop.stx.stxinfo1'
            defaultMessage='Own your digital identity and data with hundreds of decentralized apps built with Blockstack.'
          />{' '}
          <Link
            href='https://blockstack.org/try-blockstack'
            target='_blank'
            rel='noopener noreferrer'
            size='12px'
          >
            <FormattedHTMLMessage
              id='scenes.airdrop.stx.learnmore'
              defaultMessage='Learn more'
            />
          </Link>
        </Text>
        <StatusContainer>
          <div>
            <StxStatus {...props} />
          </div>
          <Date>
            <Text size='16px' color='grey800' weight={600}>
              <FormattedMessage
                id='scenes.airdrop.stx.feb'
                defaultMessage='Feb. 2020'
              />
            </Text>
            <Text size='12px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.airdrop.stx.date'
                defaultMessage='Airdrop Date'
              />
            </Text>
          </Date>
        </StatusContainer>
        <div style={{ marginTop: '26px' }}>
          <StxShare {...props} />
        </div>
        <OverflowFooterText size='12px' color='grey600'>
          <FormattedMessage
            id='scenes.airdrop.stx.regulatory'
            defaultMessage="* For regulatory reasons, USA, Canada and Japan nationals can't participate in the airdrop."
          />
        </OverflowFooterText>
      </div>
    </Box>
  )
}

export default StxAirdrop
