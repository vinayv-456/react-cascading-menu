const { Dropdown } = require("react-bootstrap");

// At dropdown level
const state = {
  selected: { label, value }, // should support pre-population
  isOpen: boolean,
};
const dpRef = useRef();
// implement useClickOutside(hook) but for a change i want to do using event manager

// At item level
// take className from the user for each item
const classes = {
  [`${this.props.baseClassName}-option`]: true,
  [option.className]: !!option.className,
  "is-selected": isSelected,
};

// key={value}
// className={optionClass}
// onMouseDown={this.setValue.bind(this, value, label)}
// onClick={this.setValue.bind(this, value, label)}
// role='option'
// aria-selected={isSelected ? 'true' : 'false'}
// {...dataAttributes}

// provide option to provide the class-names for each of the part of the Dropdown
// baseClassName, controlClassName, placeholderClassName, menuClassName, arrowClassName, arrowClosed, arrowOpen, className

// multi select
// when implementing the useclick outside on a element then we don't neeed to define a ref and then apply useclickoutside hook
// by passing the ref and the clickoutsideHandler

/**
 * props
 * 
 * showCheckbox
 * highlightOption
 * toggleOptionsList
 * groupedObject
 * closeIconType // provide icon options take some strings and map it to actual icons
 * groupby // groupby certain key in the list
 * isObject, // can be direct value or an object
 * displayValue // which value of all the items needs to be displayed
 * selectionLimit
 * emptyRecordMsg
 * caseSensitiveSearch
 * keepSearchTerm
 * selectedValues // items to be selected before
 * disablePreSelectedValues // Prevent to deselect the preselected values

/**
 * need to have following functionalities and some can be exposed by ref
 * resetSelectedValues: reset : option to reset the dropdown
 * getSelectedItems, 
 * getSelectedItemsCount
 * 
 * and points to consider while implementing these functions
 * if !showCheckbox && !singleSelect then remove the items from the list
 * onSelect, onRemove, onSearch, onKeyPressFn is passed as sepearate prop instead of ref pull
 */

/**
 * utility fns
 * matchValues: 263
 * onArrowKeyNavigation: 273 up, down, enter, backspace(?)
 */

/**
 * intresting issues
 * if the user is using restSelectedValues and want to notify after completion like he had some dependent task then
 *  --- it will be difficult to implement in functional component as there is not return like useState in class based components
 * line 140: onMount we are triggering artifically by having eventListner click, and then focusing it in the handler
 * ---- But the component is mounted long before right?
 *
 *
 *
 *
 *
 */

/**
 * Cascading dropdown features
 * search(through multiple levels) -> populate the selection
 * Multi/single selection
 * filter lock
 * local search at single level
 * select all options
 */

/**
 * design ideas
 * local search is fine, can expand the searchbox on search icon click
 * global search should cover the entire menu
 * tags should be shown at idividual level as well at the global level
 */

/**
 * export the following methods through imperative ref handler
 * isCompletelySelected(locks/complete till the leaf)
 *
 */

/**
 * feature priority order:
 * multi-select
 * tags
 * search - autocomplete
 * lock
 * select-all
 * accessability
 * animations
 * theme
 * documentation(storybook)
 * testcases
 */

/**
 * issues:
 * issues with inconsitent childIDs in activeItem or selectedItems which can cause huge bugs
 */
