/// <reference types="Cypress" />
import { id } from '../support/app.ids'

describe("App", () => {

    beforeEach(() => {

        // @notes: stub route for tests 6-8, here
        /**
         * EF: Please see open cy bugs for both cy.route() and cy.intercept(), ugh...
         * cy.route() unable to mock same url multiple times if requests happen quickly -- [https://github.com/cypress-io/cypress/issues/4460]
         * cy.intercept()Overriding interceptors doesn't work. -- [https://github.com/cypress-io/cypress/issues/9302]
         */

    });

    it("1. renders", () => {
        cy.getByTestId("app").should("be.visible");
    });
    it("2. can increment a counter", () => {
        cy.getByTestId(id.count_value).should('contain', '0');
        cy.getByTestId(id.increment).click();
        // @notes: write an assertion that the value has actually increased
        cy.getByTestId(id.count_value).should('contain', '1');
    });
    it("3. can decrement a counter", () => {
        cy.getByTestId(id.count_value).should('contain', '0');
        cy.getByTestId(id.increment).click();
        cy.getByTestId(id.count_value).should('contain', '1');
        cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.count_value).should('contain', '0');
    });
    it("4. submit button is disabled if the counter is > 20", () => {
        for (let n = 0; n < 20; n++) { // EF: future perf - set count on initial render 
            cy.getByTestId(id.increment).click();
        }
        cy.getByTestId(id.submit).should('not.be.disabled'); // test 20 / boundary analysis
        cy.getByTestId(id.increment).click();
        cy.getByTestId(id.submit).should('be.disabled'); // test 21
        cy.getByTestId(id.increment).click();
        cy.getByTestId(id.submit).should('be.disabled'); // test 22
    });
    it("5. submit button is disabled if the counter is < -10", () => {
        for (let n = 0; n < 10; n++) { // EF: future perf - set count on initial render
            cy.getByTestId(id.decrement).click();
        }
        cy.getByTestId(id.submit).should('not.be.disabled'); // test -10 / boundary analysis
        cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.submit).should('be.disabled'); // test -11
        cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.submit).should('be.disabled'); // test -12
    });
    // @notes: there is an API server running at http://localhost:3002/*, but it is currently wired to
    //         return a 500 for all requests. This is to simulate a service being down. For the following
    //         tests you will need to mock the requests to make them pass. #6 & #7 should fire a request to
    //         http://localhost:3002 when the submit button is hit, causing an effect
    it("6. displays an error if a request is submitted with count < 0", () => {
        cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.submit).click();
        cy.getByTestId(id.error).should('be.visible');
        cy.contains('There was an error submitted your count!');
    });
    it("7. displays a success message if a request is submitted with count >= 0", () => {
        cy.getByTestId(id.increment).click();
        cy.getByTestId(id.submit).click();
        cy.getByTestId(id.success).should('be.visible');
        cy.contains('Count submitted');
    });
    it("8. fetches an initial count from a mocked endpoint and uses that count on initial render", () => {
        // @notes:
        // 1. hide the UI
        // 2. show a loading indicator
        // 3. the stubbed request must take > 500ms
        // 4. ensure the correct number is initially rendered
        cy.server();
        cy.route({ method: 'POST', url: 'http://localhost:3002/count', body: '3', response: '3' }).as('setInitialCount');
        // cy.visit("/");
        cy.wait('@setInitialCount');
        cy.getByTestId(id.count_value).should('contain', '3');
    });
    it.only("9. (using cy.intercept) fetches an initial count from a mocked endpoint and uses that count on initial render", () => {
        // @EF: same as #8 - just using cy.intercept() which does not require cy.server()

        const loadData = () => {
            fetch("http://localhost:3002/count", {
                method: "POST",
                body: JSON.stringify(4),
            })
            setTimeout(600);
        }

        cy.intercept('POST', 'http://localhost:3002/count', (req) => {
            // set the request body to something different before it's sent to the destination
            req.body = '4';
        }).as('count')
        cy.visit("/");
        loadData()
            //cy.contains('Loading...');
        cy.wait('@count');

        cy.getByTestId(id.count_value).should('contain', '4');
    });
    // @notes: feel free to add any other tests you feel this app _should_ have
    it("10. error message is hidden when count changes", () => {
        cy.visit("/"); // failing in beforeEach consistnetly without this 2nd call (\_(ツ)_/¯) have a feeling it has to do with above intercept test cases
        cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.submit).click();
        cy.getByTestId(id.error);
        cy.contains('There was an error submitted your count!');
        cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.error).should('not.exist');
    });
    it("11. success message is hidden when count changes", () => {
        cy.visit("/");
        cy.getByTestId(id.increment).click();
        cy.getByTestId(id.submit).click();
        cy.getByTestId(id.success);
        cy.contains('Count submitted');
        cy.getByTestId(id.increment).click();
        cy.getByTestId(id.success).should('not.exist');
    });
    it.skip("12. (not implimented) should not be able to submit request when count > 20 ", () => {
        // EF: similar to test #4 except test the request
    });
    it.skip("13. (not implimented) should not be able to submit request when count < -10 ", () => {
        // EF: similar to test #5 except test the request
    });
    it.skip("14. (not implimented) should look like before ", () => {
        // EF: take a screen shot :)
    });

});