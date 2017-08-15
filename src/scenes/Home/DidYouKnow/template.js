import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, Text, Typography } from 'blockchain-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding-left: 15px;
  box-sizing: border-box;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 0;
`
const Content = styled.div`
  width: 100%;
  border: 1px solid #D2CED0;
  padding: 10px;
  box-sizing: border-box;
`
const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const BottomRow = styled.div`
  text-align: justify;
`
const PaddedIcon = styled(Icon)`
  padding: 5px;
`

const DidYouKnow = (props) => {
  // TODO: Localization => be careful with dybamic keys here
  // TODO: add the different colors in the typography component
  return (
    <Wrapper>
      <Header>
        <Text id='scenes.home.didyouknow.title' text='Did you know?' capitalize />
        <Text id={'scenes.home.didyouknow.' + props.info.category.name} text={props.info.category.name} uppercase />
      </Header>
      <Content>
        <TopRow>
          <PaddedIcon name={props.info.icon} giant />
          <Text id={'scenes.home.didyouknow.' + props.info.title} text={props.info.title} color={props.info.color} small />
        </TopRow>
        <BottomRow>
          <Typography small light>{props.info.description}</Typography>
        </BottomRow>
      </Content>
    </Wrapper>
  )
}

DidYouKnow.propTypes = {
  info: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    }),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  })
}

export default DidYouKnow
