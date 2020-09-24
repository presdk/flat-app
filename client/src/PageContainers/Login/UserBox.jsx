import React from "react";
import styled from "styled-components";
import { generateHash } from "../../utils/hash"

const OuterBox = styled.div`
    width: ${props => props.width};
    height: ${props => props.height};
    margin: 1em;
`;

const ColoredBox = styled.div`
    height: 80%;
    border-radius: 5px;
    background-color: ${props => props.color};
`;

const CenteredText = styled.p`
    text-align: center;
`;

const UserBox = (props) => {
    const { user, handleClick } = props;
    const color = generateColorForName(user.name);

    return (
        <OuterBox {...props} onClick={handleClick}>
            <ColoredBox color={color} />
            <CenteredText>
                {user.name}
            </CenteredText>
        </OuterBox>
    );
}

const generateColorForName = (name) => {
    const magicNumber = 400;    // Adds an offset to darken the colors
    return "#" + Math.floor(generateHash(name) + magicNumber).toString(16);
}

export default UserBox;