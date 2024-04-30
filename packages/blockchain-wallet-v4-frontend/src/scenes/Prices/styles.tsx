import { Field, BaseFieldProps } from "redux-form";
import styled from "styled-components";

export const TextFilterWrapper = styled.div`
  display: flex;
  position: relative;
  width: 300px;
`
export const IconField = styled(Field)<BaseFieldProps & { height: string; placeholder: string }>`
  div > input {
    padding-left: 40px;
  }
`
export const SearchIconWrapper = styled.div`
  position: absolute;
  top: 12px;
  left: 10px;
`