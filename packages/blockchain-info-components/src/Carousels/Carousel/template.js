import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { range } from 'ramda'

import { Color } from '../../Colors'
import { Icon } from '../../Icons'

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
  background-color: ${props =>
    props.active ? props.theme['brand-secondary'] : props.theme['gray-4']};
  cursor: pointer;
  z-index: ;
`
const Arrow = styled(Icon).attrs({
  name: 'down-arrow',
  size: '24px',
  weight: 700,
  color: 'gray-6'
})`
  position: absolute;
  top: 50%;
  margin-top: -18px;
  left: ${props => (props.left ? '10px' : 'initial')};
  right: ${props => (!props.left ? '10px' : 'initial')};
  transform: ${props => (props.left ? 'rotate(90deg)' : 'rotate(-90deg)')};
  cursor: pointer;
  z-index: 1;

  &:hover {
    color: ${Color('brand-secondary')}!important;
  }
`

const Carousel = props => {
  const {
    index,
    total,
    height,
    arrows,
    chips,
    children,
    handleClick,
    handlePrevious,
    handleNext
  } = props

  return (
    <Wrapper>
      <Content height={height} total={total}>
        {arrows && <Arrow left onClick={handlePrevious} />}
        <Slider height={height} index={index} total={total}>
          {children}
        </Slider>
        {arrows && <Arrow onClick={handleNext} />}
      </Content>
      {chips && (
        <Controls>
          {range(0, total + 1).map((value, arrayIndex) => (
            <Control
              key={arrayIndex}
              onClick={() => handleClick(value)}
              active={index === value}
            />
          ))}
        </Controls>
      )}
    </Wrapper>
  )
}

Carousel.propTypes = {
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  arrows: PropTypes.bool.isRequired,
  chips: PropTypes.bool.isRequired
}

export default Carousel
