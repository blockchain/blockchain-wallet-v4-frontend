import { Button, Link, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import media from 'services/ResponsiveService'
import React from 'react'
import styled from 'styled-components'

import { Container, Row } from './model'

const DarkText = styled(Text).attrs({
  color: 'grey700',
  size: '14px',
  weight: 400
})`
  display: inline;
  ${media.laptop`
    display: ${props => (props.hideOnMobile ? 'none' : 'inline')};
  `};
`
const StyledLink = styled(Link)`
  width: 100%;
`
const LearnMoreButton = styled(Button).attrs({
  nature: 'primary',
  fullwidth: true
})`
  font-weight: 500;
  ${media.laptop`
    width: 100%;
  `};
`

export const TxHistoryDownload = () => (
  <Container>
    <Row marginBottom='6px'>
      <Text color='blue900' size='24px' weight={600}>
        <FormattedMessage
          defaultMessage='Ready for 2019 Tax Season?'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.txhistory'
        />
      </Text>
    </Row>
    <Row marginBottom='24px'>
      <DarkText size='12px' weight={500}>
        <FormattedMessage
          defaultMessage='April 2020'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.txhistory.april2020'
        />
      </DarkText>
    </Row>
    <Row marginBottom='24px'>
      <DarkText>
        <FormattedMessage
          defaultMessage='You can now download your transaction history for all currencies as well as Swap! Download a report for each currency on the specific transaction pages, while your Swap report can be downloaded from the Swap order history page.'
          id='layouts.wallet.trayright.whatsnew.whatsnewcontent.txhistory.content'
        />
      </DarkText>
    </Row>
    <Row>
      <StyledLink
        target='_blank'
        href='https://support.blockchain.com/hc/en-us/articles/360041578791'
      >
        <LearnMoreButton>
          <FormattedMessage
            id='layouts.wallet.trayright.whatsnew.whatsnewcontent.txhistory.learnmore'
            defaultMessage='Learn More'
          />
        </LearnMoreButton>
      </StyledLink>
    </Row>
  </Container>
)

export default TxHistoryDownload
