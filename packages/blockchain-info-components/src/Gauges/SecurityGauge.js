import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Icon } from '../Icons'
import { Color } from '../Colors'

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  width: 52px;
  height: 8px;
  margin-left: 10px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme['gray-2']};
`
const Bar = styled.div`
  overflow: hidden;
  display: inline-flex;
  width: 15%;
  height: 100%;
  background-color: ${props => props.theme[props.color]};
`
const Empty = styled.div`
  height: 13px;
  width: 13px;
  border: 1px solid red;
  border-radius: 50%;
  margin-right: 5px;
`
const Progress = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 60px;
  padding-left: 5px;
`
const SecurityIcon = styled(Icon)`
  border-radius: 50%;
  background: ${Color('success')};
  height: 16px;
  width: 15px;
  color: white;
  cursor: default;
  margin-right: 5px;
`

const SecurityGauge = (props) => {
  const { score } = props
  const hide = score === 3

  if (hide) return null
  return (
    <Progress>
      {
        score >= 1 ? <SecurityIcon name='checkmark-in-circle' size='16px' /> : <Empty />
      }
      {
        score >= 2 ? <SecurityIcon name='checkmark-in-circle' size='16px' /> : <Empty />
      }
      {
        score === 3 ? <SecurityIcon name='checkmark-in-circle' size='16px' /> : <Empty />
      }
    </Progress>
  )
}

SecurityGauge.propTypes = {
  score: PropTypes.oneOf([0, 1, 2, 3]).isRequired
}

SecurityGauge.defaultProps = {
  score: 0
}

export default SecurityGauge
