import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import FaqRow from './../FaqRow'

const Wrapper = styled.div`
  margin-bottom: 20px;
  white-space: pre-line;
`

const GroupTitle = styled(Text)`
 font-size: 14px;
 font-weight: 600;
 padding-bottom: 4px;
`

const FaqGroup = (props) => {
  const { groupTitleMsg, groupQuestions } = props
  return (
    <Wrapper>
      <GroupTitle>{groupTitleMsg} </GroupTitle>
      {
        groupQuestions.length > 0 && groupQuestions.map((q, i) => {
          return <FaqRow title={q.question} description={q.answer} key={i} />
        })
      }
    </Wrapper>
  )
}

FaqGroup.propTypes = {
  groupTitleMsg: PropTypes.object.isRequired,
  groupQuestions: PropTypes.array.isRequired
}

export default FaqGroup
