import React from "react";
import { IconType } from "../types";
import Cancel from "./cancel.svg";
import checkboxChecked from "./checkbox-check.svg";
import checkboxUnchecked from "./checkbox-unchecked.svg";
import radioChecked from "./radio-button-checked.svg";
import radioUnchecked from "./radio-button-unchecked.svg";
import { IconCon } from "../styles";

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
  applytheme?: string;
}

const Icons = (props: Props) => {
  const { icon, width = 12, height = 12, applytheme = "true" } = props;
  const Svg = icons[icon];

  // Handle case where Svg is undefined
  if (!Svg) {
    console.log("Svg", Svg);

    console.error(`Icon ${icon} is not defined`, Svg);
    return <>icon</>; // or a fallback component
  }

  return (
    <IconCon applytheme={applytheme}>
      <Svg width={width} height={height} />
    </IconCon>
  );
};

export default Icons;
