import * as React from "react";
import * as ReactDOM from "react-dom/client";

type CreateWebComponentClassParams<T, K extends string> = {
  component: React.ComponentType<{ [key in K]: T | undefined }>;
  dataPropName: K;
  shadowDom: boolean;
};

export function createWebComponentClass<T, K extends string>({
  component,
  dataPropName,
  shadowDom,
}: CreateWebComponentClassParams<T, K>) {
  type Props = { [key in K]: T | undefined };
  return class extends HTMLElement {
    #container: HTMLElement | ShadowRoot = shadowDom ? this.attachShadow({ mode: "open" }) : this;
    #root = ReactDOM.createRoot(this.#container);
    #customData: T | undefined;

    #render() {
      const childElement = React.createElement(component, { [dataPropName]: this.#customData } as Props);
      this.#root.render(childElement);
    }

    set [dataPropName](props: T) {
      this.#customData = props;
      this.#render();
    }

    connectedCallback() {
      this.#render();
    }

    disconnectedCallback() {
      this.#root.unmount();
    }
  };
}

export function registerWebComponentClass<T, K extends string>({
  component,
  tagName,
  shadowDom = false,
  dataPropName = "customData" as K,
}: {
  component: React.ComponentType<{ [key in K]: T | undefined }>;
  dataPropName?: K;
  shadowDom?: boolean;
  tagName: string;
}) {
  if (!window.customElements.get(tagName)) {
    window.customElements.define(tagName, createWebComponentClass<T, K>({ component, dataPropName, shadowDom }));
  }
}
