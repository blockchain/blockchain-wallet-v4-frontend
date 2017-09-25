import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Image, Link, Text } from 'blockchain-info-components'
import Container from 'components/Container'
import DropdownLanguage from 'components/DropdownLanguage'

const Wrapper = styled.div`
  background-color: ${props => props.theme['brand-quaternary']};
  padding: 40px;
`
const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px;

  @media(min-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
    align-items: flex-start;
  }
`
const Column = styled.div`
  flex: 0 0 100%;
  padding: 0 20px;
  box-sizing: border-box;
  margin-bottom: 10px;

  @media(min-width: 768px) {
    flex: 0 0 20%;
  }
`
const Menu = styled.div``
const MenuHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border-bottom: 0.5px solid ${props => props.theme['brand-primary']};
  margin-bottom: 10px;
`
const MenuContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`
const MenuColumn = styled.div`
  flex: 0 0 50%;
`
const Row2 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width 100%;

  @media(min-width: 992px) {
    flex-direction: row;
    justify-content: space-around;
  }
`
const Column2 = styled(Column)`
  width: 100%;
  margin-bottom: 10px;


  @media(min-width: 992px) {
    width: 33%;
  }
`
const Copyright = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media(min-width: 992px) {
    justify-content: flex-start;
  }
`
const Terms = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  
  @media(min-width: 992px) {
    justify-content: flex-start;
  }
`
const Social = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  & > * { margin-right: 5px; }

  @media(min-width: 992px) {
    justify-content: flex-start;
  }
`

const Footer = () => {
  return (
    <Wrapper>
      <Container>
        <Row>
          <Column>
            <Image name='blockchain-logo' height='27px' />
          </Column>
          <Column>
            <Menu>
              <MenuHeader>
                <Text size='12px' weight={600} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.products' defaultMessage='Products' />
                </Text>
              </MenuHeader>
              <MenuContent>
                <MenuColumn>
                  <LinkContainer to='/wallet'>
                    <Link size='12px' weight={300} color='brand-primary' uppercase>
                      <FormattedMessage id='layouts.landing.footer.wallet' defaultMessage='Wallet' />
                    </Link>
                  </LinkContainer>
                  <LinkContainer to='/api'>
                    <Link size='12px' weight={300} color='brand-primary' uppercase>
                      <FormattedMessage id='layouts.landing.footer.api' defaultMessage='API' />
                    </Link>
                  </LinkContainer>
                  <Link href='https://blockchain.com/enterprise' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.business' defaultMessage='Business' />
                  </Link>
                  <Link href='https://blockchain.com/thunder' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.thunder' defaultMessage='Thunder' />
                  </Link>
                  <Link href='https://blockchain.com/research' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.research' defaultMessage='Research' />
                  </Link>
                </MenuColumn>
                <MenuColumn>
                  <Link href='https://blockchain.info' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.explorer' defaultMessage='Explorer' />
                  </Link>
                  <Link href='https://blockchain.info/charts' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.charts' defaultMessage='Charts' />
                  </Link>
                  <Link href='https://blockchain.info/markets' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.markets' defaultMessage='Markets' />
                  </Link>
                  <Link href='https://blockchain.info/stats' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.stats' defaultMessage='Stats' />
                  </Link>
                </MenuColumn>
              </MenuContent>
            </Menu>
          </Column>
          <Column>
            <Menu>
              <MenuHeader>
                <Text size='12px' weight={600} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.company' defaultMessage='Company' />
                </Text>
              </MenuHeader>
              <MenuContent>
                <MenuColumn>
                  <Link href='https://blockchain.com/about' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.about' defaultMessage='About' />
                  </Link>
                  <Link href='https://blockchain.com/team' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.team' defaultMessage='Team' />
                  </Link>
                  <Link href='https://blockchain.com/careers' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.careers' defaultMessage='Careers' />
                  </Link>
                  <Link href='https://blockchain.com/interview' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.interviewing' defaultMessage='Interviewing' />
                  </Link>
                  <Link href='https://blockchain.com/faq' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.faq' defaultMessage='Faq' />
                  </Link>
                </MenuColumn>
                <MenuColumn>
                  <Link href='https://blockchain.com/press' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.press' defaultMessage='Press' />
                  </Link>
                  <Link href='https://blog.blockchain.com' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.blog' defaultMessage='Blog' />
                  </Link>
                </MenuColumn>
              </MenuContent>
            </Menu>
          </Column>
          <Column>
            <Menu>
              <MenuHeader>
                <Text size='12px' weight={600} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.support' defaultMessage='Support' />
                </Text>
              </MenuHeader>
              <MenuContent>
                <MenuColumn>
                  <Link href='https://support.blockchain.com/hc/' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.helpcenter' defaultMessage='Help Center' />
                  </Link>
                  <Link href='https://blog.blockchain.com/category/tutorials-and-guides/' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.tutorials' defaultMessage='Tutorials' />
                  </Link>
                  <Link href='https://blockchain.info/wallet/bitcoin-faq' size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.learningportal' defaultMessage='Learning Portal' />
                  </Link>
                </MenuColumn>
              </MenuContent>
            </Menu>
          </Column>
          <Column>
            <DropdownLanguage color='brand-primary' />
          </Column>
        </Row>
        <Row2>
          <Column2>
            <Copyright>
              <Text size='10px' weight={300} color='brand-primary' uppercase>
                <FormattedMessage id='layouts.landing.footer.copyright' defaultMessage='2017 BLOCKCHAIN LUXEMBOURG S.A. ALL RIGHTS RESERVED.' />
              </Text>
            </Copyright>
          </Column2>
          <Column2>
            <Terms>
              <Link href='https://blockchain.com/privacy' target='_blank' size='10px' color='brand-primary' uppercase>
                <FormattedMessage id='layouts.landing.footer.privacy' defaultMessage='Privacy' />
              </Link>
              <Link href='https://blockchain.com/terms' target='_blank' size='10px' color='brand-primary' uppercase>
                <FormattedMessage id='layouts.landing.footer.terms' defaultMessage='Terms' />
              </Link>
              <Link href='https://blockchain.com/legal' target='_blank' size='10px' color='brand-primary' uppercase>
                <FormattedMessage id='layouts.landing.footer.enforcement' defaultMessage='Law enforcement guide' />
              </Link>
              <Link href='https://blockchain.info/advertise' target='_blank' size='10px' color='brand-primary' uppercase>
                <FormattedMessage id='layouts.landing.footer.advertise' defaultMessage='Advertise' />
              </Link>
            </Terms>
          </Column2>
          <Column2>
            <Social>
              <Link href='https://play.google.com/store/apps/details?id=piuk.blockchain.android&hl=en' target='_blank'>
                <Image name='android' height='32px' />
              </Link>
              <Link href='https://itunes.apple.com/us/app/blockchain-bitcoin-wallet/id493253309?mt=8' target='_blank'>
                <Image name='apple' height='32px' />
              </Link>
              <Link href='https://twitter.com/blockchain' target='_blank'>
                <Image name='twitter' height='32px' />
              </Link>
              <Link href='https://www.linkedin.com/company/blockchain' target='_blank'>
                <Image name='linkedin' height='32px' />
              </Link>
              <Link href='https://www.facebook.com/blockchain/' target='_blank'>
                <Image name='facebook' height='32px' />
              </Link>
            </Social>
          </Column2>
        </Row2>
      </Container>
    </Wrapper>
  )
}

export default Footer
