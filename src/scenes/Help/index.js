import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Separator } from 'blockchain-info-components'
import RouterLink from 'components/RouterLink'

const Wrapper = styled.div`
  width: 100%;
  padding: 40px;
  box-sigin: border-box;
  background-color: #FFFFFF;

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
      <FormattedMessage id='scenes.help.login' defaultMessage='Login help' />
      <FormattedMessage id='scenes.help.wallet' defaultMessage='Need help accessing your wallet?' />
      <Separator />
      <Row>
        <Left>
          <FormattedMessage id='scenes.help.guid' defaultMessage="I've lost my Wallet ID" />
          <FormattedMessage id='scenes.help.guid_explain' defaultMessage='Email me a reminder with my Wallet ID to my email address' />
        </Left>
        <Right>
          <RouterLink to='/reminder'>
            <Button>
              <FormattedMessage id='scenes.help.remind' defaultMessage='Remind me' />
            </Button>
          </RouterLink>
        </Right>
      </Row>
      <Separator />
      <Row>
        <Left>
          <FormattedMessage id='scenes.help.password' defaultMessage="I've lost my Wallet Password" />
          <FormattedMessage id='scenes.help.password_explain' defaultMessage='Recover your funds with your 12 word recovery passphrase' />
        </Left>
        <Right>
          <RouterLink to='/recover'>
            <Button>
              <FormattedMessage id='scenes.help.recover' defaultMessage='Recover funds' />
            </Button>
          </RouterLink>
        </Right>
      </Row>
      <Separator />
      <Row>
        <Left>
          <FormattedMessage id='scenes.help.2fa' defaultMessage="I've lost my 2FA Device" />
          <FormattedMessage id='scenes.help.2fa_explain' defaultMessage='Reset two step verification to regain access to your wallet' />
        </Left>
        <Right>
          <RouterLink to='/reset2fa'>
            <Button>
              <FormattedMessage id='scenes.help.reset' defaultMessage='Reset 2FA' />
            </Button>
          </RouterLink>
        </Right>
      </Row>
      <Separator />
      <Footer>
        <RouterLink to='/login'>
          <FormattedMessage id='scenes.help.back' defaultMessage='Go back' />
        </RouterLink>
        <Link href='https://blockchain.zendesk.com/' target='_blank'>
          <FormattedMessage id='scenes.help.contact' defaultMessage='Contact support' />
        </Link>
      </Footer>
    </Wrapper>
  )
}

export default Help
