import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Index, { CascadingMenuRef } from "./index";
import { menuGroup } from "../data/constants";
import { checkSelections } from "./test_utils/checkSelections";
import { menuGroupTreeToMap } from "./utils";

function runSelectionTest(ids: string[]) {
  const ref = createRef<CascadingMenuRef>();
  render(<Index ref={ref} menuGroup={menuGroup} />);
  const menuGroupMap = menuGroupTreeToMap(menuGroup);

  for (let i = 0; i < ids.length - 1; i++) {
    const option1 = screen.getByTestId(ids[i]);
    fireEvent.click(option1);
    const nextOption = screen.getByTestId(ids[i + 1]);
    let isCheckPassed = true;

    if (ref.current) {
      const details = ref.current.getSelectionsObjs();
      if (details) {
        const { selectedItems, activeItem } = details;
        const isSelectionsValid = checkSelections(
          menuGroupMap,
          selectedItems,
          menuGroup.id,
          false
        );
        const isActiveItemValid = checkSelections(
          menuGroupMap,
          activeItem,
          menuGroup.id,
          true
        );
        isCheckPassed = isSelectionsValid && isActiveItemValid;
      }
    }
    // console.log("isCheckPassed", isCheckPassed);
    if (isCheckPassed) {
      expect(nextOption).toBeInTheDocument;
    } else {
      fail("The check did not pass as expected.");
    }
  }
}

describe("Selection Path", () => {
  test("verify multiple item selections", () => {
    const ids = [
      "2_102",
      "3_103",
      "4_106",
      "5_109",
      "5_110",
      "2_101",
      "3_101",
      "4_101",
      "5_101",
      "3_102",
      "4_104",
      "5_105",
      "4_105",
      "5_107",
      "2_102",
      "5_109",
      "3_104",
      "4_107",
      "5_111",
      "5_112",
    ];
    runSelectionTest(ids);

    // "2_102", France
    // "3_103", Île-de-France
    // "4_106", Paris
    // "5_109", Eiffel Tower
    // "5_110", Louvre Museum
    // "2_101", United States
    // "3_101", New York
    // "4_101", New York City
    // "5_101", Statue of Liberty
    // "3_102", California
    // "4_104", Los Angeles
    // "5_105", Hollywood Walk of Fame
    // "4_105", San Francisco
    // "5_107", Golden Gate Bridge
    // "2_102", France
    // "5_109", Eiffel Tower
    // "3_104", Provence-Alpes-Côte d'Azur
    // "4_107", Nice
    // "5_111", Promenade des Anglais
    // "5_112", Castle Hill
  });
  test("verify connected path generation", () => {
    const ids = [
      "2_103",
      "3_105",
      "2_102",
      "3_103",
      "2_101",
      "2_101",
      "2_102",
      "2_101",
    ];
    // "2_103", Italy
    // "3_105", Lazio
    // "2_102", France
    // "3_103", Île-de-France
    // "2_101", United States
    // "2_101", United States
    // "2_102", France
    // "2_101", United States

    runSelectionTest(ids);
  });
});
