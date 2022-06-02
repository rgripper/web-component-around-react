import React from "react";
import { act, screen, waitFor } from "@testing-library/react";
import { registerWebComponentClass } from "./index";

describe("createWebComponentClass", () => {
  it("renders a web component with custom data", async () => {
    let dummy = ({ customData }: { customData: { message: string } | undefined }) => (
      <div>The message is: {customData?.message}</div>
    );
    registerWebComponentClass({ component: dummy, tagName: "my-dummy", dataPropName: "customData", shadowDom: false });

    let element = document.createElement("my-dummy");

    expect(document.body.innerHTML).toBe("");
    act(() => {
      document.body.append(element);
    });

    await waitFor(() => expect(document.body.innerHTML).toBe("<my-dummy><div>The message is: </div></my-dummy>"));

    act(() => {
      (element as any).customData = { message: "Where's the beef" };
    });

    await waitFor(() =>
      expect(document.body.innerHTML).toBe("<my-dummy><div>The message is: Where's the beef</div></my-dummy>")
    );
  });
});
