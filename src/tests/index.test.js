import {
  fireEvent,
  getByText,
  getByLabelText,
  getAllByText,
} from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

// function waitForDom() {
//   return new Promise((resolve) => {
//     const html = fs.readFileSync(
//       path.resolve(__dirname, "../index.html"),
//       "utf8"
//     );

//     dom = new JSDOM(html, {
//       runScripts: "dangerously",
//       resources: "usable",
//     });

//     dom.window.addEventListener("DOMContentLoaded", () => {
//       resolve();
//     });
//   });
// }

let dom;
let container;

describe("Widget tests", () => {
  // beforeAll(() => waitForDom());

  // beforeEach(() => {
  //   container = dom.window.document.body;
  // });

  // afterEach(() => {
  //   container = null;
  // });

  beforeEach(() => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "../index.html"),
      "utf8"
    );

    dom = new JSDOM(html, { runScripts: "dangerously" });
    container = dom.window.document.body;
  });

  it("renders 2 section headings", () => {
    const headingsH2 = container.querySelectorAll("h2");
    expect(headingsH2).toHaveLength(2);
    expect(getByText(container, "Filters")).toBeInTheDocument();
    expect(getByText(container, "Data")).toBeInTheDocument();
  });

  it("renders filters titles", () => {
    expect(getByText(container, "Driver")).not.toBeNull();
    expect(getByText(container, "Date")).not.toBeNull();
    expect(getByText(container, "Pay type")).not.toBeNull();
    expect(getByText(container, "Tips")).not.toBeNull();
  });

  it("renders driver filter inputs", () => {
    expect(getByLabelText(container, "1")).not.toBeNull();
    expect(getByLabelText(container, "2")).not.toBeNull();
  });

  it("renders date filters inputs", () => {
    expect(getByLabelText(container, "From")).not.toBeNull();
    expect(getByLabelText(container, "To")).not.toBeNull();
  });

  it("renders pay type filters inputs", () => {
    expect(getByLabelText(container, "Card")).not.toBeNull();
    expect(getByLabelText(container, "Cash")).not.toBeNull();
  });

  it("renders tip checkbox", () => {
    expect(getByLabelText(container, "Only with tip")).not.toBeNull();
  });

  it("renders data totals titles", () => {
    expect(getByText(container, "🔖 Total trips")).not.toBeNull();
    expect(getByText(container, "💰 Total earnings")).not.toBeNull();
  });

  it("renders data costs titles", () => {
    expect(getByText(container, "💸 Cost per trip")).not.toBeNull();
    expect(getByText(container, "💶 Cost per mile")).not.toBeNull();
  });

  it("renders data averages titles", () => {
    expect(
      getByText(container, "🚕 Trip distance (average in miles)")
    ).not.toBeNull();
    expect(
      getByText(container, "🏁 Trip duration (average in mins)")
    ).not.toBeNull();
  });

  it("renders ⏳ Loading... in each data by default", () => {
    expect(getAllByText(container, "⏳ Loading...")).toHaveLength(6);
  });

  // it("renders totals with default filters", () => {
  //   expect(getByText(container, "9.710.124 trips")).not.toBeNull();
  //   expect(getByText(container, "$150,766,448.12")).not.toBeNull();
  // });

  // it("renders costs with default filters", () => {
  //   expect(getByText(container, "$15.53")).not.toBeNull();
  //   expect(getByText(container, "$0.18")).not.toBeNull();
  // });

  // it("renders averages with default filters", () => {
  //   expect(getByText(container, "2.81 miles")).not.toBeNull();
  //   expect(getByText(container, "14.84 mins")).not.toBeNull();
  // });

  // it("updates data when clicking a new driver", () => {
  //   expect(getByLabelText(container, "1").checked).toEqual(false);
  //   fireEvent.click(getByLabelText(container, "1"));
  //   const searchParams = new URLSearchParams(window.location.search);
  //   expect(searchParams.has("driver")).toEqual(true);
  //   expect(getByLabelText(container, "1").checked).toEqual(true);
  //   expect(getByText(container, "9.710.124 trips")).toBeNull();
  //   expect(getByText(container, "4.397.921 trips")).not.toBeNull();
  // });

  // it("updates data when clicking a new pay type", () => {
  //   expect(getByLabelText(container, "Card").checked).toEqual(false);
  //   fireEvent.click(getByLabelText(container, "Card"));
  //   const searchParams = new URLSearchParams(window.location.search);
  //   expect(searchParams.has("pay_type")).toEqual(true);
  //   expect(getByLabelText(container, "Card").checked).toEqual(true);
  //   expect(getByText(container, "9.710.124 trips")).toBeNull();
  //   expect(getByText(container, "2.934.025 trips")).not.toBeNull();
  // });
});
