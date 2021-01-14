/// <reference types="Cypress" />
import { id } from '../support/app.ids'
import * as mokk from '../support/mocks/countmock'

describe("App", () => {

    beforeEach(() => {
        // cy.server();
        // cy.fixture('example.json').then(rc => {
        //     mokk.postCount(rc.count10)
        // })
        cy.visit("/")

    });

    it.only("/// Not Working ///: displays an error if a request is submitted with count < 0", () => {

        const value = -1
        cy.intercept('POST', 'http://localhost:3002/count', (req) => {
            // set the request body to something different before it's sent to the destination
            req.body = value.toString();
        }).as('count')

        cy.getByTestId(id.submit).click();

        cy.wait('@count').then(xhr => {
            console.log('xhr: ' + xhr)
            expect(xhr.request.body).to.equal("-1")
        })

        cy.getByTestId(id.error).should('be.visible');
    });

    it.only("/// Working ///: displays an error if a request is submitted with count < 0", () => {

        cy.intercept('POST', 'http://localhost:3002/count').as('count')
        cy.getByTestId(id.decrement).click()
        cy.getByTestId(id.submit).click();

        cy.wait('@count').then(xhr => {
            console.log('xhr: ' + xhr)
            expect(xhr.request.body).to.equal("-1")
        })

        cy.getByTestId(id.error).should('be.visible');

    });

    it("6. displays an error if a request is submitted with count < 0", () => {
        //cy.visit("/");


        // cy.getByTestId(id.count_value).should('contain', '25')

        // cy.intercept('POST', 'http://localhost:3002/count', '0').as('count0');
        // cy.wait('@count0');

        //cy.intercept('POST', 'http://localhost:3002/count').as('count1');

        cy.intercept('POST', 'http://localhost:3002/count', (req) => {
            // set the request body to something different before it's sent to the destination
            req.body = '-7';
        }).as('count')

        // cy.intercept('POST', 'http://localhost:3002/count', (req) => {
        //     req.body = "-20"
        // }).as('count1')

        // cy.intercept('POST', 'http://localhost:3002/count', (req) => {
        //     expect(req.body).to.include('-1')
        // }).as('count2')

        //cy.getByTestId(id.decrement).click();

        // cy.intercept({
        //     method: 'POST',
        //     url: 'http://localhost:3002/count',
        //     body: -1
        // }, {
        //     statusCode: 200,
        //     body: '-1',
        //     headers: { 'access-control-allow-origin': '*' },
        //     delayMs: 0,
        // }, ).as('count1')

        // cy.intercept('POST', 'http://localhost:3002/count', (req) => {
        //     req.reply((res) => {
        //         res.send('-12')
        //     })
        // }).as('count')


        //cy.getByTestId(id.decrement).click();
        cy.getByTestId(id.submit).click();

        cy.wait('@count').then(xhr => {
            console.log('xhr: ' + xhr)
            expect(xhr.request.body).to.equal('-7')
        })
        // cy.wait('@count2')
        // cy.get('@count1').then(xhr => {
        //     console.log('XHR: ' + xhr)
        // })

        //cy.getByTestId(id.error).should('be.visible');
        //cy.contains('There was an error submitted your count!');

    });


});