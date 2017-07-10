import React from 'react'
import styled from 'styled-components'
import zxcvbn from 'zxcvbn'

const ScoreContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 20px;
`
const ScoreBar = styled.div`
  display: inline-flex;
  width: 20%;
  height: 100%;
  box-sizing: border-box;
  border: 2px solid #FFFFFF;
  background-color: ${props =>
    props.score === 0 ? '#FFFFFF'
  : props.score === 1 ? '#660000'
  : props.score === 2 ? '#FF0000'
  : props.score === 3 ? '#E59400'
  : props.score === 4 ? '#E5E500' : '#006600'};
`
const PasswordScore = (props) => {
  let score = zxcvbn(props.value).score + 1
  console.log(score)
  return (
    <ScoreContainer>
      { score > 0 ? <ScoreBar score={score} /> : <ScoreBar score={0} /> }
      { score > 1 ? <ScoreBar score={score} /> : <ScoreBar score={0} /> }
      { score > 2 ? <ScoreBar score={score} /> : <ScoreBar score={0} /> }
      { score > 3 ? <ScoreBar score={score} /> : <ScoreBar score={0} /> }
      { score > 4 ? <ScoreBar score={score} /> : <ScoreBar score={0} /> }
    </ScoreContainer>
  )
}

export default PasswordScore
