import React from 'react'
import styled from 'styled-components'

import { Text, TextGroup } from 'blockchain-info-components'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import Announcements from './WhatsNewContent'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 30px;
  box-sizing: border-box;
  overflow-y: auto;
`
const Item = styled.div`
  width: 100%;
  height: 100%;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: auto;
`
const RowTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`
const RowDate = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  box-sizing: border-box;
`
const RowContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
`
const EmptyContent = styled.div`
  > div:first-child {
    margin-bottom: 10px;
  }
  a {
    color: ${props => props.theme['brand-secondary']};
  }
`

const WhatsNew = props => (
  <Wrapper>
    <Container>
      {
        Announcements.length ? Announcements.map((item, i) => (
          <Item key={i}>
            <RowTitle>
              <Text size='14px' weight={600}>{item.title}</Text>
            </RowTitle>
            <RowDate>
              <Text color='gray-3' weight={400} size='12px'>{item.date}</Text>
            </RowDate>
            <RowContent>
              <TextGroup inline>
                <Text size='12px' weight={300}>{item.desc}</Text>
                {item.link}
              </TextGroup>
            </RowContent>
          </Item>
        )) : <EmptyContent>
          <Text size='20px'>
            <FormattedMessage id='layouts.wallet.header.whatsnew.whatsnew.empty' defaultMessage="🎉 You're all caught up!" />
          </Text>
          <Text size='12px' weight={300} color='gray-3'>
            <FormattedHTMLMessage id='layouts.wallet.header.whatsnew.whatsnew.in_progress' defaultMessage="Our team is always working on new features, but if there's something we can improve please let us know about it <a href='https://github.com/blockchain/blockchain-wallet-v4-frontend/issues' rel='noopener noreferrer' target='_blank'>here<a/>." />
          </Text>
        </EmptyContent>
      }
    </Container>
  </Wrapper>
)

export default WhatsNew
