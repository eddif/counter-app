import "./commands";
import 'cypress-react-selector';

Cypress.on('window:before:load', win => {
    delete win.fetch;
});