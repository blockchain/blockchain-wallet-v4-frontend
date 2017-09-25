import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { range } from 'ramda'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`
const Content = styled.div`
  position: relative;
  width: 100%;
  min-height: ${props => props.height}px; 
  overflow-x: hidden;
`
const Slider = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  top: 0;
  left: ${props => props.index * -100}%;
  width: ${props => (props.total + 1) * 100}%;
  min-height: auto;
  transition: all 0.4s ease-in-out; 

  & > * {
    position: relative;
    width: 100%;
    height: 100%;
  }
`
const Controls = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
`
const Control = styled.div`
  display: flex;
  width: 10px;
  height: 10px;
  margin: 0 10px;
  border-radius: 5px;
  background-color: ${props => props.active ? props.theme['brand-secondary'] : props.theme['gray-4']};
  cursor: pointer;
  z-index: 
`

const Carousel = props => {
  const { index, total, height, children, handleClick } = props

  return (
    <Wrapper>
      <Content height={height} total={total}>
        <Slider height={height} index={index} total={total}>
          {children}
        </Slider>
      </Content>
      <Controls>
        { range(0, total + 1).map((value, arrayIndex) => <Control key={arrayIndex} onClick={() => handleClick(value)} active={index === value} />) }
      </Controls>
    </Wrapper>
  )
}

Carousel.propTypes = {
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default Carousel
