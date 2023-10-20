import { createContext, useState, useContext, useMemo } from "react";

let defaultValue = {};

if (
  localStorage.getItem("token") != null){
  defaultValue.isConnected = true;
}

const AppContext = createContext({
  config: defaultValue,
  setConfig: () => {},
});
function Context(props) {
  const [config, setConfig] = useState(defaultValue);
  const value = { config, setConfig };
  console.log("from cntx");
  console.log(value);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

export { Context, AppContext };
