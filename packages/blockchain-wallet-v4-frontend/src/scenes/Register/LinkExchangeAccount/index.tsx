import { FormattedMessage } from 'react-intl'
import { Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

const InfoWrapper = styled(Wrapper)`
  width: 360px;
  margin-right: 16px;
  padding: 0px;
`
const InnerWrapper = styled.div`
  padding: 40px;
  ${media.mobile`
    padding: 20px;
  `}
`
const Footer = styled(InnerWrapper)`
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid ${props => props.theme.grey100};
  > div {
    margin-left: 8px;
  }
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ListHeader = styled(Text)`
  font-size: 14px;
  margin-top: 20px;
  font-weight: 500;
`
const List = styled.ul`
  padding-left: 20px;
  margin-bottom: 0px;
  margin-top: 8px;
`
const ListItem = styled.li`
  margin-top: 8px;
`

const LinkExchangeAccount = () => {
  return (
    <InfoWrapper>
      <InnerWrapper>
        <Header>
          <Text size='20px' color='blue900' weight={700}>
            <FormattedMessage
              id='scenes.linkaccount.authorize1'
              defaultMessage='Authorize Exchange to connect to your Blockchain Wallet'
            />
          </Text>
        </Header>
        <ListHeader color='green500'>
          <FormattedMessage
            id='scenes.linkaccount.able_to'
            defaultMessage='The Exchange will be able to:'
          />
        </ListHeader>
        <List>
          <ListItem>
            <Text weight={500} color='grey800' size='14px'>
              <FormattedMessage
                id='scenes.linkaccount.share_levels2'
                defaultMessage='Share your Gold or Silver status'
              />
            </Text>
          </ListItem>
          <ListItem>
            <Text weight={500} color='grey800' size='14px'>
              <FormattedMessage
                id='scenes.linkaccount.share_addresses1'
                defaultMessage='Share crypto addresses so you don’t have to copy and paste'
              />
            </Text>
          </ListItem>
        </List>
        <ListHeader color='red500'>
          <FormattedMessage
            id='scenes.linkaccount.can_not_do'
            defaultMessage='The Exchange will not be able to:'
          />
        </ListHeader>
        <List>
          <ListItem>
            <Text weight={500} color='grey800' size='14px'>
              <FormattedMessage
                id='scenes.linkaccount.view_pw'
                defaultMessage='View your Wallet password, recovery phrase, or private keys'
              />
            </Text>
          </ListItem>
        </List>
      </InnerWrapper>
      <Footer>
        <Image name='blockchain-icon' height='42px' />
        <div style={{ marginLeft: '16px' }}>
          <Text size='20px' color='blue900' weight={600}>
            Exchange
          </Text>
          <Text
            weight={500}
            color='grey800'
            size='12px'
            style={{ marginTop: '4px' }}
          >
            <FormattedMessage
              id='scenes.linkaccount.by_blockchaincom'
              defaultMessage='Brought to you by Blockchain.com'
            />
          </Text>
        </div>
      </Footer>
    </InfoWrapper>
  )
}

export default LinkExchangeAccount
