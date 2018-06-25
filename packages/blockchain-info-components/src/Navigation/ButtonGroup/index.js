import React from "react"
import styled from "styled-components"

const ButtonGroup = styled.div`
    a {
        transition: opacity: .5s;
        font-weight: 500;
        color: ${props => props.theme.main};
        padding: 0 1rem;
        font-size: 1.125rem;
        margin-right: 1rem;
        user-select: none;
        cursor: pointer;
        line-height: 2.5rem;
        display: inline-block;
    }

    ul > li {
        display: inline-block;
    }

    button {
        margin-right: 1rem;
    }
    button:last-child {
        margin-right: 0;
    }
`

export default ButtonGroup
