import React from 'react'
import styled from 'styled-components'

const BasePage = styled.div`
  font-family: -apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif;
  color: rgb(68, 68, 68);
  -webkit-font-smoothing: antialiased;
  font-weight: 300;
  line-height: 1.45;
  font-size: 15px;
  border: 1px solid rgb(238, 238, 238);
  padding: 20px 40px 40px;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 3px;
  background-color: rgb(255, 255, 255);
  margin-top: 20px;
  margin-bottom: -30px;
`
const TitleContainer = styled.div`
  border-bottom: 1px solid rgb(238, 238, 238);
  padding-top: 10px;
  margin-bottom: 30px;
`
const Title = styled.h1`
  margin: 0px;
  padding: 0px;
  font-size: 25px;
`
const VisualContainer = styled.div`
  position: relative;
  & > * { margin: 0 auto; }
`
const Page = props => {
  return (
    <BasePage>
      <TitleContainer>
        <Title>Visual</Title>
      </TitleContainer>
      <VisualContainer>
        {props.children}
      </VisualContainer>
    </BasePage>
  )
}

export default Page
