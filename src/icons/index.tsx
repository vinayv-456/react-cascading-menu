import React from "react";
import { IconType } from "../types";
import Cancel from "./cancel.svg";
import checkboxChecked from "./checkbox-check.svg";
import checkboxUnchecked from "./checkbox-unchecked.svg";
import radioChecked from "./radio-button-checked.svg";
import radioUnchecked from "./radio-button-unchecked.svg";

export const ICONS = {
  CANCEL: "cancel",
  CHECKBOX_CHECKED: "checkboxChecked",
  CHECKBOX_UNCHECKED: "checkboxUnchecked",
  RADIO_CHECKED: "radioChecked",
  RADIO_UNCHECKED: "radioUnchecked",
};

const icons: IconType = {
  [ICONS.CANCEL]: Cancel,
  [ICONS.CHECKBOX_CHECKED]: checkboxChecked,
  [ICONS.CHECKBOX_UNCHECKED]: checkboxUnchecked,
  [ICONS.RADIO_CHECKED]: radioChecked,
  [ICONS.RADIO_UNCHECKED]: radioUnchecked,
};
interface Props {
  icon: string;
  width?: number;
  height?: number;
}

const Icons = (props: Props) => {
  const { icon, width = 12, height = 12 } = props;
  const Svg = icons[icon];
  return (
    <span style={{ paddingRight: "5px" }}>
      <Svg width={width} height={height} />
    </span>
  );
};

export default Icons;
