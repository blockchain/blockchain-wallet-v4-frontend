import { Box } from '../AirdropInfo'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Icon, Link, Text } from 'blockchain-info-components'
import { StxStatus } from './model'
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
`

const StxAirdrop = props => {
  return (
    <Box>
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
        style={{ marginTop: '16px' }}
      >
        <FormattedHTMLMessage
          id='scenes.airdrop.stx.stxinfo'
          defaultMessage='Own your digital identity and data. With hundreds of decentralized apps in the Blockstack ecosystem.'
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
          <Text size='16px' color='grey800' weight={500}>
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
      <Text size='11px' color='grey600' style={{ marginTop: '12px' }}>
        <FormattedMessage
          id='scenes.airdrop.stx.regulatory'
          defaultMessage="*For regulatory reasons, USA, Canada and Japan nationals can't participate in the airdrop."
        />
      </Text>
    </Box>
  )
}

export default StxAirdrop
