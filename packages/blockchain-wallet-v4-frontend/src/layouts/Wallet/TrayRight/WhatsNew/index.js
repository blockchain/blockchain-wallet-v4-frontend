import React from 'react'
import styled from 'styled-components'

import { Text, TextGroup } from 'blockchain-info-components'
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

const WhatsNew = props => (
  <Wrapper>
    <Container>
      {Announcements.map((item, i) => (
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
      ))}
    </Container>
  </Wrapper>
)

export default WhatsNew
