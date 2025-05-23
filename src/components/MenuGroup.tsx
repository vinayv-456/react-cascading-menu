import React, { useEffect, useMemo, useState } from "react";
import { DPItemProps, Item, MenuGroup, SelectedItemType } from "../types";
import "../classes.css";
import {
  DropdownGroup,
  DropdownNoresults,
  DropdownOption,
  FlexContainer,
} from "../styles";
import Icons, { ICONS } from "../icons";

const MenuGroupComp: React.FC<
  DPItemProps & { layout?: "horizontal" | "vertical" }
> = (props) => {
  const {
    menuGroup,
    activeItem,
    selectedItems,
    displayValue,
    showNext,
    handleItemSelection,
    handleMultipleChildrenSel,
    level,
    layout = "horizontal",
  } = props;
  const { options, groupHeading, id: groupId } = menuGroup;
  const { options: opt, ...parentItemObj } = menuGroup;

  // choose the default value via prop
  const isMultiSelection =
    menuGroup.isMultiSelection !== undefined
      ? menuGroup.isMultiSelection
      : true;

  const width = 13;
  const [allItemsChecked, setAllItemsChecked] = useState(false);
  const handleSelectAll = () => {
    setAllItemsChecked((prev: boolean) => {
      handleMultipleChildrenSel(options || [], groupId, !prev);
      return !prev;
    });
  };

  // tick the allItemsChecked checkbox based on the options count
  const checkIfAllItemChecked = useMemo(() => {
    if (!options) {
      return false;
    }
    return options?.every((e) => selectedItems[e.id]);
  }, [selectedItems]);

  useEffect(() => {
    setAllItemsChecked(checkIfAllItemChecked);
  }, [checkIfAllItemChecked]);

  /**
   *
   * Handled the selection of item
   */
  return (
    <>
      <DropdownGroup
        width={width}
        left={level * width}
        layout={layout}
        level={layout === "vertical" ? level : undefined}
      >
        <FlexContainer className="jc ai">
          {layout !== "vertical" && (
            <div className="grp-heading">{menuGroup.groupHeading}</div>
          )}
          {/* {isMultiSelection && options && (
            <div onClick={handleSelectAll}>
              <SelectionIcon
                isMultiSelection={options ? options.length > 0 : false}
                isChecked={allItemsChecked}
              />
            </div>
          )} */}
        </FlexContainer>
        <div className="grp-opts">
          {options?.map((ele: Item) => {
            const label = ele?.[displayValue];
            const isActive = activeItem?.[ele.id]?.id === ele.id;
            const fadeActive =
              !isActive && selectedItems?.[ele.id]?.id === ele.id;
            const hasOptions = ele.options;

            return (
              <React.Fragment key={ele.id}>
                <DropdownOption
                  key={ele.id}
                  data-testid={ele.id}
                  fadeactive={fadeActive.toString()}
                  active={isActive.toString()}
                  className="opt-label"
                  level={layout === "vertical" ? level : undefined}
                  layout={layout}
                  onClick={() =>
                    // TODO: use only the part of the parentItemObj
                    handleItemSelection(
                      ele,
                      groupHeading,
                      parentItemObj.id,
                      isMultiSelection
                    )
                  }
                >
                  <SelectionIcon
                    isMultiSelection={isMultiSelection}
                    isChecked={isActive || fadeActive}
                    layout={layout}
                  />
                  <div style={{ width: "100%" }}>{label}</div>
                </DropdownOption>
                {layout === "vertical" && hasOptions && (
                  <MenuGroupComp
                    menuGroup={ele}
                    activeItem={activeItem}
                    selectedItems={selectedItems}
                    displayValue={displayValue}
                    showNext={false}
                    handleItemSelection={handleItemSelection}
                    handleMultipleChildrenSel={handleMultipleChildrenSel}
                    level={level + 1}
                    layout={layout}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </DropdownGroup>
      {layout === "horizontal" &&
        options?.map((ele: Item) => {
          const isSubMenuActive = activeItem?.[ele.id];
          const hasOptions = ele.options;
          return (
            <React.Fragment key={ele.id}>
              {isSubMenuActive && hasOptions && (
                <MenuGroupComp
                  menuGroup={ele}
                  activeItem={activeItem}
                  selectedItems={selectedItems}
                  displayValue={displayValue}
                  showNext={false}
                  handleItemSelection={handleItemSelection}
                  handleMultipleChildrenSel={handleMultipleChildrenSel}
                  level={level + 1}
                  layout={layout}
                />
              )}
            </React.Fragment>
          );
        })}
    </>
  );
};

export default MenuGroupComp;

interface SelectionIconProps {
  isMultiSelection: boolean;
  isChecked: boolean;
  layout: "horizontal" | "vertical";
}

const SelectionIcon = ({
  isMultiSelection,
  isChecked,
  layout,
}: SelectionIconProps) => {
  return (
    <>
      {isChecked ? (
        <Icons
          icon={isMultiSelection ? ICONS.CHECKBOX_CHECKED : ICONS.RADIO_CHECKED}
          layout={layout}
          applytheme={false.toString()}
        />
      ) : (
        <Icons
          icon={
            isMultiSelection ? ICONS.CHECKBOX_UNCHECKED : ICONS.RADIO_UNCHECKED
          }
          layout={layout}
          applytheme={false.toString()}
        />
      )}
    </>
  );
};

MenuGroupComp.defaultProps = {
  showNext: true,
};
