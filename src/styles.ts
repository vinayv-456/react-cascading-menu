import styled, { css } from "styled-components";

export interface StyledCompProps {
  left?: number;
  fadeActive?: boolean;
  active?: boolean;
  checkbox?: boolean;
  radio?: boolean;
}

export const DropdownMenu = styled.div`
  width: 100%;
  position: relative;
  margin: 0;
  padding: 0.25rem 0;
  box-sizing: border-box;
  overflow-y: auto;
  z-index: 1000;
  -webkit-overflow-scrolling: touch;
  color: #000;
  font-family: Roboto, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-size: 1rem;
  letter-spacing: 0.00937em;
  line-height: 1.5rem;
  list-style-type: none;
  text-decoration: inherit;
  text-transform: inherit;
`;

export const DropdownGroup = styled.div<StyledCompProps>`
  left: ${(props) => `${props.left}rem`};
  background-color: ${(props) => props.theme.background};
  min-width: 15rem;
  width: max-content;
  height: 10rem;
  max-height: 20rem;
  overflow-y: auto;
  box-sizing: border-box;

  & + & {
    /* left: 13rem; */
    min-height: 100%;
    position: absolute;
    top: 0;
  }
`;

export const DropdownOption = styled.div<StyledCompProps>`
  box-sizing: border-box;
  color: rgba(51, 51, 51, 0.8);
  cursor: pointer;
  align-items: center;
  display: flex;
  min-height: 2.5rem;
  padding: 0.5rem 1.5rem;

  /* fadeActive stylings */
  ${(props) =>
    props.fadeActive &&
    css`
      background-color: rgba(29, 29, 29, 0.8);
      opacity: 0.7;
      & > div {
        color: #ccc;
      }
      &.checkbox::before {
        content: "\\f146";
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        font-size: 1.5rem;
        margin-right: 8px;
      }
      &.radio::before {
        content: "\\f192";
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        font-size: 1.5rem;
        margin-right: 8px;
      }
    `}

  /* active stylings */
  ${(props) =>
    props.active &&
    css`
      background-color: rgba(29, 29, 29, 0.8);
      & > div {
        color: #ccc;
      }
      &.checkbox::before {
        content: "\\f146";
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        font-size: 1.5rem;
        margin-right: 8px;
      }
      &.radio::before {
        content: "\\f192";
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
        font-size: 1.5rem;
        margin-right: 8px;
      }
    `}

  &.checkbox::before {
    content: "\\f0fe";
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    font-size: 1.5rem;
    margin-right: 8px;
  }

  &.radio::before {
    content: "\\f111";
    font-family: "Font Awesome 5 Free";
    font-weight: 900;
    font-size: 1.5rem;
    margin-right: 8px;
  }
`;

export const DropdownNoresults = styled.div<StyledCompProps>`
  box-sizing: border-box;
  color: #ccc;
  cursor: default;
  display: block;
  padding: 8px 10px;
`;

export const TagContainer = styled.div`
  background-color: azure;
  width: 100vw;
  min-height: 100px;
  max-height: 125px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
`;

export const TagItem = styled.div`
  position: relative;
  min-width: 80px;
  border: 1px solid black;
  border-radius: 8px;
  height: fit-content;
  padding: 10px;
  margin-right: 5px;
`;

export const TagHover = styled.span`
  position: absolute;
  display: none;
  background-color: cadetblue;
  cursor: pointer;
`;

export const TagLabel = styled.span`
  &:hover + ${TagHover} {
    display: block;
  }
`;
