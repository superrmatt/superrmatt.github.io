import React from "react";

function Container(properties) {
  return <div className={`container${properties.fluid ? "-fluid" : ""}`}>{properties.children}</div>;
}

export default Container;
