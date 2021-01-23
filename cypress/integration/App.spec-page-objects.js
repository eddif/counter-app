/// <reference types="Cypress" />
import { CounterPage } from "../page-objects/counter-page";
import { id } from "../support/app.ids";

describe("App (Page Objects)", () => {
    const counterApp = new CounterPage();
    beforeEach(() => {
        // @notes: stub route for tests 6-8, here
        /**
         * Stubs and cy.visit were added to each test case due to Cypress having issues with alias
         * See: https://github.com/cypress-io/cypress/issues/9302
         *
         */
    });

    it("1. renders", () => {
        cy.visit("/");
        counterApp.getCountValue().should("be.visible");
    });
    it("2. can increment a counter", () => {
        cy.visit("/");
        counterApp.validateCount(0);
        counterApp.clickIncrement();
        counterApp.validateCount(1);
    });
    it("3. can decrement a counter", () => {
        cy.visit("/");
        counterApp.validateCount(0);
        counterApp.clickDecrement();
        counterApp.validateCount(-1);
    });
    it("4. submit button is disabled if the counter is > 20", () => {
        cy.visit("/");
        counterApp.clickIncrement(20);
        counterApp.validateSubmitButton("not.be.disabled"); // 20
        counterApp.clickIncrement();
        counterApp.validateSubmitButton("be.disabled"); // 21
        counterApp.clickIncrement();
        counterApp.validateSubmitButton("be.disabled"); // 22
    });
    it("5. submit button is disabled if the counter is < -10", () => {
        cy.visit("/");
        counterApp.clickDecrement(10);
        counterApp.validateSubmitButton("not.be.disabled"); // -10
        counterApp.clickDecrement();
        counterApp.validateSubmitButton("be.disabled"); // -11
        counterApp.clickDecrement();
        counterApp.validateSubmitButton("be.disabled"); // -12
    });
    [-1, -10].map((count) => {
        it(`6. displays an error if a request is submitted with count < ${count}`, () => {
            cy.intercept("http://localhost:3002/count", `${count}`).as("getCount");
            cy.visit("/");
            counterApp.clickSubmit();
            counterApp.validateErrorMessage("be.visible");
            cy.contains("There was an error submitted your count!");
        });
    });
    [0, 1, 19, 20].map((count) => {
        it(`7. displays a success message if a request is submitted with count >= ${count}`, () => {
            cy.intercept("http://localhost:3002/count", `${count}`).as("getCount");
            cy.visit("/");
            counterApp.clickSubmit();
            counterApp.validateSuccessMessage("be.visible");
            cy.contains("Count submitted");
        });
    });
    it("8. fetches an initial count from a mocked endpoint and uses that count on initial render", () => {
        Cypress.config("responseTimeout", 1200);
        cy.intercept("http://localhost:3002/count", {
            statusCode: 200,
            body: "-100",
            headers: { Loading: "true" },
            delayMs: 1000,
        }).as("count");
        cy.visit("/");
        cy.contains("Loading...").log("check loading indicator shows");
        cy.wait("@count").its("response.body").should("contain", -100);
        counterApp.validateCount("-100");
    });
    it("9. error message is hidden when count changes", () => {
        cy.visit("/");
        counterApp.clickDecrement();
        counterApp.clickSubmit();
        counterApp.validateErrorMessage("be.visible");
        cy.contains("There was an error submitted your count!");
        counterApp.clickDecrement().click();
        counterApp.validateErrorMessage("not.exist");
    });
    it("10. success message is hidden when count changes", () => {
        cy.visit("/");
        counterApp.clickIncrement();
        counterApp.clickSubmit();
        counterApp.validateSuccessMessage("be.visible");
        cy.contains("Count submitted");
        counterApp.clickIncrement().click();
        counterApp.validateSuccessMessage("not.exist");
    });
    it("11. submit button is disabled when initial request count > 20 ", () => {
        cy.intercept("http://localhost:3002/count", "21").as("getCount");
        cy.visit("/");
        counterApp.validateSubmitButton("be.disabled");
    });
    it("12. submit button is disabled when initial request count < -10 ", () => {
        cy.intercept("http://localhost:3002/count", "-11").as("getCount");
        cy.visit("/");
        counterApp.validateSubmitButton("be.disabled");
    });
    it("13. reset should set count to zero ", () => {
        cy.intercept("http://localhost:3002/count", "99").as("getCount");
        cy.visit("/");
        counterApp.validateCount("99");
        cy.getByTestId(id.reset).click();
        counterApp.validateCount("0");
    });
});