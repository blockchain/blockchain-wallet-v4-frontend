import React from 'react'
import styled from 'styled-components'
// import { Text } from 'blockchain-info-components'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  height: 40px;
`
// const Error = styled(Text)`
//   position: absolute;
//   display: block;
//   top: 40px;
//   left: 0;
//   height: 15px;
// `
// const getErrorState = (meta) => {
//   return !meta.touched ? 'initial' : (meta.invalid ? 'invalid' : 'valid')
// }

const CodeInputBoxes = field => {
  // const errorState = getErrorState(field.meta)

  return (
    <Container>
      <span>code input boxes</span>
      {/* <TextInput {...field.input} errorState={errorState} placeholder={field.placeholder} /> */}
      {/* {field.meta.touched && field.meta.error && <Error size='12px' weight={400} color='error'>{field.meta.error}</Error>} */}
    </Container>
  )
}

export default CodeInputBoxes
