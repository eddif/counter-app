export const postCount = (response, count) => {
    let endpoint = 'http://localhost:3002/count';

    cy.route({
        method: 'POST',
        url: `${endpoint}`,
        response,
    }).as('postCount')
};