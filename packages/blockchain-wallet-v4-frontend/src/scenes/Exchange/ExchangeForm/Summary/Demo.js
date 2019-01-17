import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { Wrapper, Title, Note } from 'components/Exchange'

const DemoWrapper = styled(Wrapper)`
  background-color: #f5f6f8;
`
const DemoTitle = styled(Title)`
  font-size: 24px;
  line-height: 29px;
  color: ${props => props.theme['brand-primary']};
`
const DemoText = styled(Text)`
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 24px;
  color: ${props => props.theme['brand-primary']};
`
const DemoNote = styled(Note)`
  margin-top: 0;
  margin-bottom: 16px;
`
const DemoNoteTitle = styled(Text)`
  display: inline;
  font-size: 12px;
  color: ${props => props.theme['brand-primary']};
`

const DemoSummary = () => (
  <DemoWrapper>
    <DemoTitle>
      <FormattedMessage
        id='scenes.exchange.exchangeform.summary.demo_title'
        defaultMessage="Trading your crypto doesn't mean trading away control."
      />
    </DemoTitle>
    <DemoText>
      <FormattedMessage
        id='scenes.exchange.exchangeform.summary.demo_text'
        defaultMessage='Swap enables you to trade crypto with low fees, live rates, and quick settlement, all while maintaining full control of your funds.'
      />
    </DemoText>
    <DemoNote>
      <DemoNoteTitle>
        <FormattedMessage
          id='scenes.exchange.exchangeform.summary.low_fees'
          defaultMessage='Low Fees'
        />
        {': '}
      </DemoNoteTitle>
      <FormattedMessage
        id='scenes.exchange.exchangeform.summary.demo_note_1'
        defaultMessage="Great news! You don't have to go to an exchange to get the best prices."
      />
    </DemoNote>
    <DemoNote>
      <DemoNoteTitle>
        <FormattedMessage
          id='scenes.exchange.exchangeform.summary.higher_limits'
          defaultMessage='Higher Limits'
        />
        {': '}
      </DemoNoteTitle>
      <FormattedMessage
        id='scenes.exchange.exchangeform.summary.demo_note_2'
        defaultMessage='Like to trade big? Get access to limits of up to $25,000 per day.'
      />
    </DemoNote>
    <DemoNote>
      <DemoNoteTitle>
        <FormattedMessage
          id='scenes.exchange.exchangeform.summary.easy_to_use'
          defaultMessage='Easy to use'
        />
        {': '}
      </DemoNoteTitle>
      <FormattedMessage
        id='scenes.exchange.exchangeform.summary.demo_note_3'
        defaultMessage='Get started in just a few steps'
      />
    </DemoNote>
  </DemoWrapper>
)

export default DemoSummary
