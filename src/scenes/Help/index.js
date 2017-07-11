import React from 'react'
import styled from 'styled-components'

import { Button } from 'components/generic/Button'
import { Link, RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Separator } from 'components/generic/Separator'

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
      <Text id='scenes.help.login' text='Login help' biggest light capitalize />
      <Text id='scenes.help.wallet' text='Need help accessing your wallet?' small light altFont />
      <Separator />
      <Row>
        <Left>
          <Text id='scenes.help.guid' text="I've lost my Wallet ID" small />
          <Text id='scenes.help.guid_explain' text='Email me a reminder with my Wallet ID to my email address' smaller light />
        </Left>
        <Right>
          <RouterLink to='/reminder'>
            <Button>
              <Text id='scenes.help.remind' text='Remind me' small capitalize />
            </Button>
          </RouterLink>
        </Right>
      </Row>
      <Separator />
      <Row>
        <Left>
          <Text id='scenes.help.password' text="I've lost my Wallet Password" small />
          <Text id='scenes.help.password_explain' text='Recover your funds with your 12 word recovery passphrase' smaller light />
        </Left>
        <Right>
          <RouterLink to='/recover'>
            <Button>
              <Text id='scenes.help.recover' text='Recover funds' small capitalize />
            </Button>
          </RouterLink>
        </Right>
      </Row>
      <Separator />
      <Row>
        <Left>
          <Text id='scenes.help.2fa' text="I've lost my 2FA Device" small />
          <Text id='scenes.help.2fa_explain' text='Reset two step verification to regain access to your wallet' smaller light />
        </Left>
        <Right>
          <RouterLink to='/reset2fa'>
            <Button>
              <Text id='scenes.help.reset' text='Reset 2FA' small capitalize />
            </Button>
          </RouterLink>
        </Right>
      </Row>
      <Separator />
      <Footer>
        <RouterLink to='/login'><Text id='scenes.help.back' text='Go back' small light cyan /></RouterLink>
        <Link href='https://blockchain.zendesk.com/' target='_blank'><Text id='scenes.help.contact' text='Contact support' small light cyan capitalize /></Link>
      </Footer>
    </Wrapper>
  )
}

export default Help
