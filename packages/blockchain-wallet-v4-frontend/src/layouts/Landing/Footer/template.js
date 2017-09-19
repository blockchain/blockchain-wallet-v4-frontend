import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Image, Link, Text, TextGroup } from 'blockchain-info-components'
import Container from 'components/Container'
import DropdownLanguage from 'components/DropdownLanguage'

const Wrapper = styled.div`
  background-color: ${props => props.theme['brand-quaternary']};
  padding: 40px;
`
const Navigation = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
const Top = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: stretch;
  width: 100%;

  @media(min-width: 768px) { 
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`
const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  padding-top: 20px;
  width: 100%;

  @media(min-width: 768px) { 
    flex-direction: row;
    justify-content: space-between;
  }
`
const Logo = styled(Image)`
  display: flex;
  padding-right: 20px;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  & > * {
    padding-top: 3px;
    padding-bottom: 2px;
  }
`

const SubcolumnWrapper = styled(Top)`
  border-top: 0.5px solid ${props => props.theme['brand-primary']};
  & > * {
    padding-right: 10px;
  }

  & > :last-child {
    padding-right: 0px;
  }
`

const SettingColumn = styled(Column)`
  align-items: flex-end;
  padding-top: 20px;
`

const DropdownContainer = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 300;
`
const CopyrightText = styled(Text)`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const CopyrightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`

const SectionTitle = styled(Text)``

const SocialContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;

  @media(min-width: 768px) {
    align-items: stretch;
  }
`

const Footer = () => {
  return (
    <Wrapper>
      <Navigation>
        <Top>
          <Logo name='blockchain-logo' height='27px' />
          <Column>
            <SectionTitle size='12px' weight={600} color='brand-primary' uppercase>
              <FormattedMessage id='layouts.landing.footer.products' defaultMessage='Products' />
            </SectionTitle>
            <SubcolumnWrapper>
              <Column>
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
              </Column>
              <Column>
                <Link href='https://blockchain.info' size='12px' weight={300} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.explorer' defaultMessage='Explorer' />
                </Link>
                <Link href='https://blockchain.info/charts/' size='12px' weight={300} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.charts' defaultMessage='Charts' />
                </Link>
                <Link href='https://blockchain.info/markets/' size='12px' weight={300} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.markets' defaultMessage='Markets' />
                </Link>
                <Link href='https://blockchain.info/stats/' size='12px' weight={300} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.stats' defaultMessage='Stats' />
                </Link>
              </Column>
            </SubcolumnWrapper>
          </Column>
          <Column>
            <SectionTitle size='12px' weight={600} color='brand-primary' uppercase>
              <FormattedMessage id='layouts.landing.footer.company' defaultMessage='Company' />
            </SectionTitle>
            <SubcolumnWrapper>
              <Column>
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
              </Column>
              <Column>
                <Link href='https://blockchain.com/press' size='12px' weight={300} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.press' defaultMessage='Press' />
                </Link>
                <Link href='https://blog.blockchain.com' size='12px' weight={300} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.blog' defaultMessage='Blog' />
                </Link>
              </Column>
            </SubcolumnWrapper>
          </Column>
          <Column>
            <SectionTitle size='12px' weight={600} color='brand-primary' uppercase>
              <FormattedMessage id='layouts.landing.footer.support' defaultMessage='Support' />
            </SectionTitle>
            <SubcolumnWrapper>
              <Column>
                <Link href='https://support.blockchain.com/hc/' size='12px' weight={300} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.helpcenter' defaultMessage='Help Center' />
                </Link>
                <Link href='https://blog.blockchain.com/category/tutorials-and-guides/' size='12px' weight={300} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.tutorials' defaultMessage='Tutorials' />
                </Link>
                <Link href='https://blockchain.info/wallet/bitcoin-faq' size='12px' weight={300} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.learningportal' defaultMessage='Learning Portal' />
                </Link>
              </Column>
            </SubcolumnWrapper>
          </Column>
          <SettingColumn>
            <DropdownContainer>
              <DropdownLanguage color='brand-primary' />
            </DropdownContainer>
            <DropdownContainer>
              <DropdownLanguage color='brand-primary' />
            </DropdownContainer>
            <TextGroup inline>
              <Text size='12px' weight={600} color='brand-primary' uppercase>
              Advanced view:
            </Text>
              <Link size='12px' weight={300} uppercase>
              Enable
            </Link>
            </TextGroup>
          </SettingColumn>
        </Top>
        <Bottom>
          <CopyrightText size='10px' weight={300} color='brand-primary' uppercase>
            <FormattedMessage id='layouts.landing.footer.copyright' defaultMessage='2017 BLOCKCHAIN LUXEMBOURG S.A. ALL RIGHTS RESERVED.' />
          </CopyrightText>
          <CopyrightContainer>
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
          </CopyrightContainer>
          <SocialContainer>
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
          </SocialContainer>
        </Bottom>
      </Navigation>
    </Wrapper>
  )
}

export default Footer
