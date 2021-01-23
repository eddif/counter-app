/// <reference types="Cypress" />
import { id } from "../support/app.ids";

describe("App", () => {
    beforeEach(() => {
        // @notes: stub route for tests 6-8, here
        /**
         * Stubs and cy.visit were added to each test case due to Cypress having issues with alias
         * See: https://github.com/cypress-io/cypress/issues/9302
         * excution time: 12.31
         */
    });

    it("1. renders", () => {
        cy.visit("/");
        cy.getByTestId("app").should("be.visible");
    });
    it("2. can increment a counter", () => {
        cy.visit("/");
        cy.getByTestId(id.count_value).should("contain", "0");
        cy.getByTestId(id.increment).click();
        // @notes: write an assertion that the value has actually increased
        cy.getByTestId(id.count_value).should("contain", "1");
    });
    it("3. can decrement a counter", () => {
        cy.visit("/");
        cy.getByTestId(id.count_value).should("contain", "0");
        cy.getByTestId(id.increment).click();
        cy.getByTestId(id.count_value).should("contain", "1");
        cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.count_value).should("contain", "0");
    });
    it("4. submit button is disabled if the counter is > 20", () => {
        cy.visit("/");
        for (let n = 0; n < 20; n++) {
            // EF: future perf - set count on initial render
            cy.getByTestId(id.increment).click();
        }
        cy.getByTestId(id.submit).should("not.be.disabled"); // test 20 / boundary analysis
        cy.getByTestId(id.increment).click();
        cy.getByTestId(id.submit).should("be.disabled"); // test 21
        cy.getByTestId(id.increment).click();
        cy.getByTestId(id.submit).should("be.disabled"); // test 22
    });
    it("5. submit button is disabled if the counter is < -10", () => {
        cy.visit("/");
        for (let n = 0; n < 10; n++) {
            // EF: future perf - set count on initial render
            cy.getByTestId(id.decrement).click();
        }
        cy.getByTestId(id.submit).should("not.be.disabled"); // test -10 / boundary analysis
        cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.submit).should("be.disabled"); // test -11
        cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.submit).should("be.disabled"); // test -12
    });
    // @notes: there is an API server running at http://localhost:3002/*, but it is currently wired to
    //         return a 500 for all requests. This is to simulate a service being down. For the following
    //         tests you will need to mock the requests to make them pass. #6 & #7 should fire a request to
    //         http://localhost:3002 when the submit button is hit, causing an effect
    [-1, -10].map((count) => {
        it(`6. displays an error if a request is submitted with count < ${count}`, () => {
            cy.intercept("http://localhost:3002/count", `${count}`).as("getCount");
            cy.visit("/");
            cy.getByTestId(id.submit).click();
            cy.getByTestId(id.error).should("be.visible");
            cy.contains("There was an error submitted your count!");
        });
    });
    [0, 1, 19, 20].map((count) => {
        it(`7. displays a success message if a request is submitted with count >= ${count}`, () => {
            cy.intercept("http://localhost:3002/count", `${count}`).as("getCount");
            cy.visit("/");
            cy.getByTestId(id.submit).click();
            cy.getByTestId(id.success).should("be.visible");
            cy.contains("Count submitted");
        });
    });
    it("8. fetches an initial count from a mocked endpoint and uses that count on initial render", () => {
        // @notes:
        // 1. hide the UI
        // 2. show a loading indicator
        // 3. the stubbed request must take > 500ms
        // 4. ensure the correct number is initially rendered
        Cypress.config("responseTimeout", 1200); // change timeout for this test only
        cy.intercept("http://localhost:3002/count", {
            statusCode: 200,
            body: "-100",
            headers: { Loading: "true" },
            delayMs: 1000,
        }).as("count");
        cy.visit("/");
        cy.contains("Loading...").log("check loading indicator shows");
        cy.wait("@count").its("response.body").should("contain", -100);
        cy.getByTestId(id.count_value).should("contain", "-100");
    });
    // @notes: feel free to add any other tests you feel this app _should_ have
    it("9. error message is hidden when count changes", () => {
        cy.visit("/");
        cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.submit).click();
        cy.getByTestId(id.error);
        cy.contains("There was an error submitted your count!");
        cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.error).should("not.exist");
    });
    it("10. success message is hidden when count changes", () => {
        cy.visit("/");
        cy.getByTestId(id.increment).click();
        cy.getByTestId(id.submit).click();
        cy.getByTestId(id.success);
        cy.contains("Count submitted");
        cy.getByTestId(id.increment).click();
        cy.getByTestId(id.success).should("not.exist");
    });
    it("11. submit button is disabled when initial request count > 20 ", () => {
        cy.intercept("http://localhost:3002/count", "21").as("getCount");
        cy.visit("/");
        cy.getByTestId(id.submit).should("be.disabled");
    });
    it("12. submit button is disabled when initial request count < -10 ", () => {
        cy.intercept("http://localhost:3002/count", "-11").as("getCount");
        cy.visit("/");
        cy.getByTestId(id.submit).should("be.disabled");
    });
    it("13. reset should set count to zero ", () => {
        cy.intercept("http://localhost:3002/count", "99").as("getCount");
        cy.visit("/");
        cy.getByTestId(id.count_value).should("contain", "99");
        cy.getByTestId(id.reset).click();
        cy.getByTestId(id.count_value).should("contain", "0");
    });
});