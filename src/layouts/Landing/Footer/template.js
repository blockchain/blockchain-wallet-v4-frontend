import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Grid } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { Image, Link, Text } from 'blockchain-info-components'
import DropdownLanguage from 'components/DropdownLanguage'

const Wrapper = styled.div`
  background-color: #E3EFF5;
  padding: 40px;
`
const Container = styled(Grid)`
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
  justify-content: center;
  align-items: center;
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

  & > a { padding: 5px 0; }
`
const DropdownContainer = styled.div`
  display: flex;
  margin-top: 20px;

  & .btn-primary {
    font-weight: 400;
    font-size: 0.9rem;
    text-transform: uppercase;
    background-color: transparent!important;
    color: #10ADE4!important;
    border: none!important;
    padding: 0;
  }

  @media(min-width: 768px) {
    margin: 0;
  }
`
const CopyrightContainer = styled.div`
  text-align: center;
  padding: 30px 0;

  & > div, a {
    display: inline-block;
    padding: 0 10px;
  }
`
const Footer = () => {
  return (
    <Wrapper>
      <Container>
        <Top>
          <Logo name='blockchain-blue' height='20px' />
          <Column>
            <Text color='cyan' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.products' defaultMessage='Products' />
            </Text>
            <LinkContainer to='/wallet'>
              <Text uppercase>
                <FormattedMessage id='components.layouts.landing.footer.wallet' defaultMessage='Wallet' />
              </Text>
            </LinkContainer>
            <Link href='https://blockchain.com/enterprise' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.business' defaultMessage='Business' />
            </Link>
            <Link href='https://blockchain.com/research' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.research' defaultMessage='Research' />
            </Link>
            <Link href='https://blockchain.info' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.explorer' defaultMessage='.Info Explorer' />
            </Link>
            <Link href='https://support.blockchain.com' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.support' defaultMessage='Support' />
            </Link>
          </Column>
          <Column>
            <Text color='cyan' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.company' defaultMessage='Company' />
            </Text>
            <Link href='https://blockchain.com/about' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.about' defaultMessage='About' />
            </Link>
            <Link href='https://blockchain.com/team' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.team' defaultMessage='Team' />
            </Link>
            <Link href='https://blockchain.com/careers' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.careers' defaultMessage='Careers' />
            </Link>
            <Link href='https://blockchain.com/interview' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.interviewing' defaultMessage='Interviewing' />
            </Link>
            <Link href='https://blockchain.com/faq' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.faq' defaultMessage='Faq' />
            </Link>
          </Column>
          <Column>
            <Text color='cyan' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.news' defaultMessage='News' />
            </Text>
            <Link href='https://blockchain.com/press' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.press' defaultMessage='Press' />
            </Link>
            <Link href='https://blog.blockchain.com' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.blog' defaultMessage='Blog' />
            </Link>
          </Column>
          <DropdownContainer>
            <DropdownLanguage />
          </DropdownContainer>
        </Top>
        <Bottom>
          <CopyrightContainer>
            <Text color='cyan' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.copyright' defaultMessage='2017 BLOCKCHAIN LUXEMBOURG S.A. ALL RIGHTS RESERVED.' />
            </Text>
            <Link href='https://blockchain.com/privacy' target='_blank' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.privacy' defaultMessage='Privacy' />
            </Link>
            <Link href='https://blockchain.com/terms' target='_blank' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.terms' defaultMessage='Terms' />
            </Link>
            <Link href='https://blockchain.com/legal' target='_blank' uppercase>
              <FormattedMessage id='components.layouts.landing.footer.enforcement' defaultMessage='Law enforcement guide' />
            </Link>
          </CopyrightContainer>
        </Bottom>
      </Container>
    </Wrapper>
  )
}

export default Footer
