import * as React from "react";
import * as ReactDOM from "react-dom";

type WebComponentUpdater = (
  component: React.ComponentType,
  reactModule: typeof React,
  reactDOMModule: typeof ReactDOM
) => void;

function createWebComponent(
  component: React.ComponentType,
  reactModule: typeof React,
  reactDOMModule: typeof ReactDOM
): {
  elementClass: typeof HTMLElement;
  updater: WebComponentUpdater;
} {
  return null as any;
}

const registry = new Map<string, WebComponentUpdater>();
function addOrUpdatewebComponent(
  elementName: string,
  component: React.ComponentType,
  reactModule: typeof React,
  reactDOMModule: typeof ReactDOM
) {
  const updater = registry.get(elementName);
  if (updater) {
    updater(component, reactModule, reactDOMModule);
  } else {
    const { elementClass, updater } = createWebComponent(component, reactModule, reactDOMModule);
    registry.set(elementName, updater);
    window.customElements.define(elementName, elementClass);
  }
}
