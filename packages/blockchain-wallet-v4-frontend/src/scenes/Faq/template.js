import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Link } from 'blockchain-info-components'
import FaqRow from './FaqRow'
// import Questions from './Questions'

const Wrapper = styled.section`
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
`
const Header = styled.div`
  width: 100%;
  padding: 10px 0;
  font-family: 'Montserrat', Helvetica, sans-serif;
  font-size: 20px;
  font-weight: 300;
  text-transform: capitalize;
  line-height: 1.1;
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;

  & > * { margin-bottom: 10px; }
`

const Faq = props => (
  <Wrapper>
    <Header>
      <FormattedMessage id='scenes.faq.title' defaultMessage='Frequently asked questions' />
    </Header>
    {
      props.questions.map((q, i) => {
        return <FaqRow title={q.title} description={q.description} key={i} />
      })
    }
    <Footer>
      <FormattedMessage id='scenes.faq.needmorehelp' defaultMessage="Can't find what you're looking for?" />
      <Link href='https://blockchain.zendesk.com' target='_blank'>
        <Button nature='primary'>
          <FormattedMessage id='scenes.faq.supportcenter' defaultMessage='Support center' />
        </Button>
      </Link>
    </Footer>
  </Wrapper>
)

export default Faq
