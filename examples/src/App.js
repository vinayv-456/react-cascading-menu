// examples/example1/src/App.js
import React from "react";
import "./react-contexify/ReactContexify.css"; // Adjust the path accordingly
import { ContextMenu, Item, Separator, menuProvider } from "./react-contexify";

function onClick(item, target) {
  // item is the item component on which you clicked. You can access all the props
  console.log(item);
  // target refer to the html node on which the menu is triggered
  console.log(target);
}

const MyAwesomeMenu = () => {
  return (
    <ContextMenu id="121">
      <Item label="Add" icon="fa fa-plus" onClick={onClick} />
      <Item label="Remove" icon="fa fa-trash" onClick={onClick} />
      <Separator />
      <Item label="Paste" icon="fa fa-clipboard" disabled />
    </ContextMenu>
  );
};

const Hodor = () => <div>Hodor</div>;

// wrap your component
const HodorWithContextMenu = menuProvider("121")(Hodor);

const App = () => {
  return (
    <div>
      <h1>Your React App</h1>
      <HodorWithContextMenu />
      <MyAwesomeMenu />
    </div>
  );
};

export default App;
