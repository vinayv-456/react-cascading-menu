import React from "react";
import classes from "react-style-classes";
import { DPItemProps, Item } from "../types";

const DropdownMenu: React.FC<DPItemProps> = (props) => {
  const { options, isObject, displayValue, groupby, emptyRecordMsg } = props;

  return (
    <div className={classes("Dropdown-menu")}>
      {options.length === 0 ? (
        <div className={classes("Dropdown-noresults")}> {emptyRecordMsg}</div>
      ) : null}
      {options?.map((ele: Item) => {
        const label = isObject ? ele?.[displayValue] : ele;
        return (
          <>
            <div className={classes("Dropdown-option")}>{label}</div>
          </>
        );
      })}
    </div>
  );
};

export default DropdownMenu;
