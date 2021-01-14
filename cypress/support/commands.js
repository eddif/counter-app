Cypress.Commands.add("getByTestId", (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});

Cypress.Commands.add("findByTestId", { prevSubject: true }, (subject, id) => {
  return subject.find(`[data-testid=${id}]`);
});
