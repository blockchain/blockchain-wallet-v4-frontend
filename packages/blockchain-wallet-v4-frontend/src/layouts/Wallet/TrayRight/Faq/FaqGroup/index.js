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

const FaqGroup = props => (
  <Wrapper>
    {props.groupQuestions.length > 0 && <GroupTitle>{props.groupTitleMsg} </GroupTitle>}
    {props.groupQuestions.map((q, i) => <FaqRow title={q.question} description={q.answer} key={i} />)}
  </Wrapper>
)

FaqGroup.propTypes = {
  groupTitleMsg: PropTypes.object.isRequired,
  groupQuestions: PropTypes.array.isRequired
}

export default FaqGroup
