import React from 'react'
import styled from 'styled-components'

import { Text, TextGroup } from 'blockchain-info-components'
import Announcements from './WhatsNewContent'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`
const RowTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
  box-sizing: border-box;
  overflow: hidden;
`
const RowDate = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  overflow: hidden;
`
const RowContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
  overflow: hidden;
`

const WhatsNew = props => (
  <Wrapper>
    {Announcements.map((item, i) => (
      <Container key={i}>
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
      </Container>
    ))}
  </Wrapper>
)

export default WhatsNew
