import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Link } from 'blockchain-info-components'
import FaqRow from 'components/FaqRow'
import Question1 from './Question1'
import Question2 from './Question2'
import Question3 from './Question3'
import Question4 from './Question4'
import Question5 from './Question5'
import Question6 from './Question6'
import Question7 from './Question7'
import Question8 from './Question8'

const Wrapper = styled.section`
  padding: 30px;
  box-sizing: border-box;
`
const Header = styled.div`
  width: 100%;
  padding: 10px 0;
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

const Faq = () => {
  return (
    <Wrapper>
      <Header>
        <FormattedMessage id='scenes.faq.title' defaultMessage='Frequently asked questions' />
      </Header>
      <FaqRow component={Question1} />
      <FaqRow component={Question2} />
      <FaqRow component={Question3} />
      <FaqRow component={Question4} />
      <FaqRow component={Question5} />
      <FaqRow component={Question6} />
      <FaqRow component={Question7} />
      <FaqRow component={Question8} />
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
}

export default Faq
