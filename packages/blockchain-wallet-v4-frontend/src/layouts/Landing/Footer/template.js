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

  & > * { padding: 5px 0; }
`
const DropdownContainer = styled.div`
  display: flex;
  font-size: 13px;
  padding: 5px 0;
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
      <Navigation>
        <Top>
          <Logo name='blockchain-blue' height='20px' />
          <Column>
            <Text size='13px' weight={500} color='brand-secondary' uppercase>
              <FormattedMessage id='layouts.landing.footer.products' defaultMessage='Products' />
            </Text>
            <LinkContainer to='/wallet'>
              <Text size='13px' weight={500} color='transferred' uppercase>
                <FormattedMessage id='layouts.landing.footer.wallet' defaultMessage='Wallet' />
              </Text>
            </LinkContainer>
            <Link href='https://blockchain.com/enterprise' size='13px' weight={500} color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.business' defaultMessage='Business' />
            </Link>
            <Link href='https://blockchain.com/research' size='13px' weight={500} color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.research' defaultMessage='Research' />
            </Link>
            <Link href='https://blockchain.info' size='13px' weight={500} color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.explorer' defaultMessage='.Info Explorer' />
            </Link>
            <Link href='https://support.blockchain.com' size='13px' weight={500}color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.support' defaultMessage='Support' />
            </Link>
          </Column>
          <Column>
            <Text size='13px' weight={500} color='brand-secondary' uppercase>
              <FormattedMessage id='layouts.landing.footer.company' defaultMessage='Company' />
            </Text>
            <Link href='https://blockchain.com/about' size='13px' weight={500} color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.about' defaultMessage='About' />
            </Link>
            <Link href='https://blockchain.com/team' size='13px' weight={500} color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.team' defaultMessage='Team' />
            </Link>
            <Link href='https://blockchain.com/careers' size='13px' weight={500} color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.careers' defaultMessage='Careers' />
            </Link>
            <Link href='https://blockchain.com/interview' size='13px' weight={500} color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.interviewing' defaultMessage='Interviewing' />
            </Link>
            <Link href='https://blockchain.com/faq' size='13px' weight={500} color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.faq' defaultMessage='Faq' />
            </Link>
          </Column>
          <Column>
            <Text size='13px' weight={500} color='brand-secondary' uppercase>
              <FormattedMessage id='layouts.landing.footer.news' defaultMessage='News' />
            </Text>
            <Link href='https://blockchain.com/press' size='13px' weight={500} color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.press' defaultMessage='Press' />
            </Link>
            <Link href='https://blog.blockchain.com' size='13px' weight={500} color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.blog' defaultMessage='Blog' />
            </Link>
          </Column>
          <DropdownContainer>
            <DropdownLanguage />
          </DropdownContainer>
        </Top>
        <Bottom>
          <CopyrightContainer>
            <Text size='10px' color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.copyright' defaultMessage='2017 BLOCKCHAIN LUXEMBOURG S.A. ALL RIGHTS RESERVED.' />
            </Text>
            <Link href='https://blockchain.com/privacy' target='_blank' size='10px' color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.privacy' defaultMessage='Privacy' />
            </Link>
            <Link href='https://blockchain.com/terms' target='_blank' size='10px' color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.terms' defaultMessage='Terms' />
            </Link>
            <Link href='https://blockchain.com/legal' target='_blank' size='10px' color='transferred' uppercase>
              <FormattedMessage id='layouts.landing.footer.enforcement' defaultMessage='Law enforcement guide' />
            </Link>
          </CopyrightContainer>
        </Bottom>
      </Navigation>
    </Wrapper>
  )
}

export default Footer
