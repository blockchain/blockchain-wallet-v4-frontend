import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Color } from '../Colors/index.ts'
import { Icon } from '../Icons'

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
  cursor: inherit;
  margin-right: 5px;
`

const SecurityGauge = props => {
  const { score } = props
  const hide = score === 3

  if (hide) return null
  return (
    <Progress>
      {score >= 1 ? (
        <SecurityIcon name='checkmark-in-circle' size='16px' />
      ) : (
        <Empty />
      )}
      {score >= 2 ? (
        <SecurityIcon name='checkmark-in-circle' size='16px' />
      ) : (
        <Empty />
      )}
      {score === 3 ? (
        <SecurityIcon name='checkmark-in-circle' size='16px' />
      ) : (
        <Empty />
      )}
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
