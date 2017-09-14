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
const Navigation = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
const Top = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const Logo = styled(Image)`
  display: flex;
  margin-bottom: 20px;
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
  & > * {
    padding-right: 20px;
  }

  & > :last-child {
    padding-right: 0px;
  }
`

const DropdownContainer = styled.div`
  display: flex;
  font-size: 13px;
  padding: 0px 0;
`
const CopyrightContainer = styled.div`
  text-align: left;
  padding: 30px 0;

  & > div, a {
    display: inline-block;
    padding: 0 10px;
  }
`
const SectionTitle = styled(Text)`
  width: 100%;
  border-bottom: 0.5px solid ${props => props.theme['brand-primary']};
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
                  <Text size='12px' weight={300} color='brand-primary' uppercase>
                    <FormattedMessage id='layouts.landing.footer.wallet' defaultMessage='Wallet' />
                  </Text>
                </LinkContainer>
                <Link href='#' size='12px' weight={300} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.api' defaultMessage='API' />
                </Link>
                <Link href='https://blockchain.com/enterprise' size='12px' weight={300} color='brand-primary' uppercase>
                  <FormattedMessage id='layouts.landing.footer.business' defaultMessage='Business' />
                </Link>
                <Link href='#' size='12px' weight={300} color='brand-primary' uppercase>
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
            <Link href='https://support.blockchain.com/hc/' size='12px' weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='layouts.landing.footer.helpcenter' defaultMessage='Help Center' />
            </Link>
            <Link href='#' size='12px' weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='layouts.landing.footer.tutorials' defaultMessage='Tutorials' />
            </Link>
            <Link href='#' size='12px' weight={300} color='brand-primary' uppercase>
              <FormattedMessage id='layouts.landing.footer.learningportal' defaultMessage='Learning Portal' />
            </Link>
          </Column>

          <DropdownContainer>
            <DropdownLanguage color='brand-primary' />
          </DropdownContainer>
        </Top>
        <Bottom>
          <CopyrightContainer>
            <Text size='10px' color='brand-primary' uppercase>
              <FormattedMessage id='layouts.landing.footer.copyright' defaultMessage='2017 BLOCKCHAIN LUXEMBOURG S.A. ALL RIGHTS RESERVED.' />
            </Text>
            <Link href='https://blockchain.com/privacy' target='_blank' size='10px' color='brand-primary' uppercase>
              <FormattedMessage id='layouts.landing.footer.privacy' defaultMessage='Privacy' />
            </Link>
            <Link href='https://blockchain.com/terms' target='_blank' size='10px' color='brand-primary' uppercase>
              <FormattedMessage id='layouts.landing.footer.terms' defaultMessage='Terms' />
            </Link>
            <Link href='https://blockchain.com/legal' target='_blank' size='10px' color='brand-primary' uppercase>
              <FormattedMessage id='layouts.landing.footer.enforcement' defaultMessage='Law enforcement guide' />
            </Link>
          </CopyrightContainer>
        </Bottom>
      </Navigation>
    </Wrapper>
  )
}

export default Footer
