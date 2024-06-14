import styled, { css } from "styled-components";

export interface StyledCompProps {
  left?: number;
  fadeActive?: boolean;
  active?: boolean;
  checkbox?: boolean;
  radio?: boolean;
}

export const MainContainer = styled.div`
  width: 100%;
  height: max(300px, 100%);
  display: flex;
  flex-direction: column;
`;

export const DropdownMenu = styled.div`
  /* width: 100%; */
  flex: 1;
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
  box-shadow: #d1d9e6 8px 8px 16px, #d1d9e6 -8px -8px 16px;
`;

export const DropdownGroup = styled.div<StyledCompProps>`
  left: ${(props) => `${props.left}rem`};
  background-color: ${(props) => props.theme.background};
  width: 13rem;
  word-wrap: none;
  /* width: max-content; */
  height: 10rem;
  max-height: 20rem;
  overflow-y: auto;
  box-sizing: border-box;
  padding-right: 1rem;
  max-width: 20rem;
  overflow-x: auto;
  border-right: 3px dotted #f6f6f6;

  & + & {
    /* left: 13rem; */
    min-height: 100%;
    position: absolute;
    top: 0;
  }
  & .grp-heading {
    padding: 8px;
    font-weight: bold;
    position: fixed;
    z-index: 100;
    width: calc(13rem - 40px);
    background-color: ${(props) => props.theme.background};
  }
  & .grp-opts {
    position: absolute;
    top: 40px;
    width: 100%;
  }
  & .opt-label {
    margin-bottom: 1px;
    width: 100%;
    & div {
      text-decoration: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export const DropdownOption = styled.div<StyledCompProps>`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background-color: #efefef;
  color: rgba(51, 51, 51, 0.8);
  cursor: pointer;
  align-items: center;
  display: flex;
  min-height: 2.5rem;
  padding: 0rem 1.5rem;

  /* fadeActive stylings */
  ${(props) =>
    props.fadeActive &&
    css`
      background-color: ${(props) => props.theme.selected};
      opacity: 0.7;
      & > div {
        color: #ccc;
      }
    `}

  /* active stylings */
  ${(props) =>
    props.active &&
    css`
      background-color: ${(props) => props.theme.selected};
      & > div {
        color: #ccc;
      }
    `}
`;

export const DropdownNoresults = styled.div<StyledCompProps>`
  box-sizing: border-box;
  color: #ccc;
  cursor: default;
  display: block;
  padding: 8px 10px;
`;

export const TagContainer = styled.div`
  width: 100vw;
  min-height: 100px;
  max-height: 125px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
`;

export const TagItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  min-width: 80px;
  border: 1px solid black;
  border-radius: 8px;
  height: 20px;
  padding: 5px;
  margin-right: 5px;
  & .cancel-icon {
    padding: 8px 5px;
  }
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
