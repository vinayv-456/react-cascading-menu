import React from "react";
import { IconType } from "../types";
import Cancel from "./cancel.svg";

export const ICONS = {
  CANCEL: "cancel",
};

const icons: IconType = {
  [ICONS.CANCEL]: Cancel,
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
    <>
      <Svg width={width} height={height} />
    </>
  );
};

export default Icons;
