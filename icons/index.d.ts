import React from "react";
export declare const ICONS: {
    CANCEL: string;
    CHECKBOX_CHECKED: string;
    CHECKBOX_UNCHECKED: string;
    RADIO_CHECKED: string;
    RADIO_UNCHECKED: string;
};
interface Props {
    icon: string;
    width?: number;
    height?: number;
}
declare const Icons: (props: Props) => React.JSX.Element;
export default Icons;
