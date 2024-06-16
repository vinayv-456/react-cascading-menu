import styled, { css } from "styled-components";

export interface StyledCompProps {
  left?: number;
  width?: number | string;
  height?: number | string;
  fadeactive?: string;
  active?: string;
  checkbox?: boolean;
  radio?: boolean;
  applytheme?: string;
}
export const MainContainer = styled.div<StyledCompProps>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  min-height: 200px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.background2};
`;

export const MenuGroupContainer = styled.div`
  flex: 1;
  position: relative;
  margin: 0;
  box-sizing: border-box;
  overflow-y: auto;
  z-index: 10;
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
  /* box-shadow: #d1d9e6 8px 8px 16px, #d1d9e6 -8px -8px 16px; */
`;

export const DropdownGroup = styled.div<StyledCompProps>`
  position: absolute;
  left: ${(props) => `${props.left}rem`};
  background-color: ${(props) => props.theme.background};
  width: ${(props) => `${props.width}rem`};
  word-wrap: none;
  /* width: max-content; */
  height: 10rem;
  max-height: 20rem;
  overflow-y: auto;
  max-width: 20rem;
  overflow-x: auto;
  border-right: 3px dotted #f6f6f6;
  height: 100%;

  & + & {
    /* left: 13rem; */
    position: absolute;
    top: 0;
  }
  & .grp-heading {
    position: sticky;
    top: 0px;
    padding: 8px;
    font-weight: bold;
    z-index: 100;
    width: 100%;
    background-color: ${(props) => props.theme.background};
    color: ${({ theme }) => theme.text};
  }
  & .grp-opts {
    top: 40px;
    width: 100%;
  }
  & .opt-label {
    margin-bottom: 1px;
    width: ${(props) => props.width};
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
  background-color: ${({ theme }) => theme.background2};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  align-items: center;
  display: flex;
  min-height: 2.5rem;
  padding: 0rem 1.5rem;

  /* fadeActive stylings */
  ${(props) =>
    props.fadeactive === "true" &&
    css`
      background-color: ${(props) => props.theme.selected};
      opacity: 0.7;
      & > div {
        color: #ccc;
      }
    `}

  /* active stylings */
  ${(props) =>
    props.active === "true" &&
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
  width: 100%;
  min-height: 100px;
  max-height: 125px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  margin-top: 10px;
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
  cursor: pointer;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text2};

  & .cancel-icon {
    padding: 8px 5px;
  }
`;

export const TagHover = styled.span`
  display: none;
  position: absolute;
  top: 100%;
  z-index: 1000;
  background-color: ${({ theme }) => theme.selected};
  /* opacity: 0.7; */
  border-radius: 5px;
  padding: 3px;
  width: 200px;
`;

export const TagLabel = styled.span`
  &:hover + ${TagHover} {
    display: block;
  }
`;

export const IconCon = styled.span<StyledCompProps>`
  padding-right: 5px;
  svg g {
    fill: ${({ theme, applytheme }) =>
      applytheme === "true" ? theme.text : ""};
  }
`;
