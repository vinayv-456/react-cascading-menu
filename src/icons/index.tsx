import React from "react";
import { IconType } from "../types";
import Cancel from "./cancel.svg";
import CheckboxChecked from "./checkbox-check.svg";
import CheckboxUnchecked from "./checkbox-unchecked.svg";
import RadioChecked from "./radio-button-checked.svg";
import RadioUnchecked from "./radio-button-unchecked.svg";
import { IconCon } from "../styles";

export const ICONS = {
  CANCEL: "cancel",
  CHECKBOX_CHECKED: "checkboxChecked",
  CHECKBOX_UNCHECKED: "checkboxUnchecked",
  RADIO_CHECKED: "radioChecked",
  RADIO_UNCHECKED: "radioUnchecked",
};

interface Props {
  icon: string;
  width?: number;
  height?: number;
  applytheme?: string;
}

const Icons = (props: Props) => {
  const { icon, width = 12, height = 12, applytheme = "true" } = props;
  const getIconJSX = (): JSX.Element | null => {
    switch (icon) {
      case ICONS.CANCEL:
        return <Cancel width={width} height={height} />;
      case ICONS.CHECKBOX_CHECKED:
        return <CheckboxChecked width={width} height={height} />;
      case ICONS.CHECKBOX_UNCHECKED:
        return <CheckboxUnchecked width={width} height={height} />;
      case ICONS.RADIO_CHECKED:
        return <RadioChecked width={width} height={height} />;
      case ICONS.RADIO_UNCHECKED:
        return <RadioUnchecked width={width} height={height} />;
      default:
        console.error(`Icon ${icon} is not defined`);
        return null; // Return null if icon is not found
    }
  };

  const IconJSX = getIconJSX();

  // Handle case where the icon is not found
  if (!IconJSX) {
    return <>icon</>; // Fallback if the icon does not exist
  }

  // Render the icon JSX inside IconCon
  return <IconCon applytheme={applytheme}>{IconJSX}</IconCon>;
};

export default Icons;
