import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.exchangeLogin};
  position: relative;
  padding: 24px !important;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;

  & > div {
    height: 100%;
    flex: auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .content {
      height: 70%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  }
`

const Footer = styled.div`
  width: 100%;
`

const Login = () => {
  return (
    <Wrapper>
      <div>
        <div className='content' />
      </div>
      <Footer />
    </Wrapper>
  )
}

export default Login
