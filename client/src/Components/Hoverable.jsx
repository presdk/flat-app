import React from "react";
import styled from "styled-components";

const StyledHoverable = styled.div`
    opacity: ${props => props.isSelected ? 1 : 0.4};
    :hover {
        cursor: pointer;
        opacity: 1;
    }
`;

export default function Hoverable(props) {
    return (
        <StyledHoverable {...props}>
            {props.children}
        </StyledHoverable>
    );
}