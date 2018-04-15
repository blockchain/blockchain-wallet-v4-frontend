import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Link, Separator, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const Left = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  & :first-child { margin-bottom: 10px; }
`
const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
`

const Help = (props) => {
  return (
    <Wrapper>
      <Text size='30px' weight={300}>
        <FormattedMessage id='scenes.help.login' defaultMessage='Login Help' />
      </Text>
      <Text size='13px' weight={300}>
        <FormattedMessage id='scenes.help.wallet' defaultMessage='Need help accessing your wallet?' />
      </Text>
      <Separator />
      <Row>
        <Left>
          <Text size='14px' weight={500}>
            <FormattedMessage id='scenes.help.guid' defaultMessage="I've lost my Wallet ID" />
          </Text>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.help.guid_explain' defaultMessage='Email me a reminder with my Wallet ID to my email address' />
          </Text>
        </Left>
        <Right>
          <LinkContainer to='/reminder'>
            <Button>
              <FormattedMessage id='scenes.help.remind' defaultMessage='Remind Me' />
            </Button>
          </LinkContainer>
        </Right>
      </Row>
      <Separator />
      <Row>
        <Left>
          <Text size='14px' weight={500}>
            <FormattedMessage id='scenes.help.password' defaultMessage="I've lost my Wallet Password" />
          </Text>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.help.password_explain' defaultMessage='Recover your funds with your 12 word backup phrase' />
          </Text>
        </Left>
        <Right>
          <LinkContainer to='/recover'>
            <Button>
              <FormattedMessage id='scenes.help.recover' defaultMessage='Recover Funds' />
            </Button>
          </LinkContainer>
        </Right>
      </Row>
      <Separator />
      <Row>
        <Left>
          <Text size='14px' weight={500}>
            <FormattedMessage id='scenes.help.2fa' defaultMessage="I've lost my 2FA Device" />
          </Text>
          <Text size='13px' weight={300}>
            <FormattedMessage id='scenes.help.2fa_explain' defaultMessage='Reset two step verification to regain access to your wallet' />
          </Text>
        </Left>
        <Right>
          <LinkContainer to='/reset2fa'>
            <Button>
              <FormattedMessage id='scenes.help.reset' defaultMessage='Reset 2FA' />
            </Button>
          </LinkContainer>
        </Right>
      </Row>
      <Separator />
      <Footer>
        <LinkContainer to='/login'>
          <Link size='13px' weight={300}>
            <FormattedMessage id='scenes.help.back' defaultMessage='Go Back' />
          </Link>
        </LinkContainer>
        <Link href='https://support.blockchain.com/' target='_blank' size='13px' weight={300}>
          <FormattedMessage id='scenes.help.contact' defaultMessage='Contact Support' />
        </Link>
      </Footer>
    </Wrapper>
  )
}

export default Help
