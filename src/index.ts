import * as React from "react";
import * as ReactDOM from "react-dom";

type CreateWebComponentClassParams<T> = {
  componentType: React.ComponentType<T>;
  customPropsFieldName: string;
};

const privatePropsFieldName = Symbol("privatePropsFieldName");

export function createWebComponentClass<T extends {} = any>({
  componentType,
  customPropsFieldName = "customProps",
}: CreateWebComponentClassParams<T>) {
  return class extends HTMLElement {
    [privatePropsFieldName]: T;

    set [customPropsFieldName](props: T) {
      this[privatePropsFieldName] = props;
      this.render();
    }

    render() {
      const props = this[privatePropsFieldName];
      const childElement = React.createElement(componentType, props);
      return ReactDOM.render(childElement, this);
    }

    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
      ReactDOM.unmountComponentAtNode(this);
    }
  };
}
