const id = {
    count_value: "count-value",
    increment: "increment",
    decrement: "decrement",
    submit: "submit",
    error: "error",
    success: "success",
    reset: "reset",
};

export class CounterPage {
    getCountValue() {
        return cy.getByTestId(id.count_value);
    }
    clickIncrement(numberOfClicks) {
        if (numberOfClicks) {
            for (let n = 0; n < numberOfClicks; n++) {
                cy.getByTestId(id.increment).click();
            }
        } else {
            return cy.getByTestId(id.increment).click();
        }
    }
    clickDecrement(numberOfClicks) {
        if (numberOfClicks) {
            for (let n = 0; n < numberOfClicks; n++) {
                cy.getByTestId(id.decrement).click();
            }
        } else {
            return cy.getByTestId(id.decrement).click();
        }
    }
    clickSubmit() {
        return cy.getByTestId(id.submit).click();
    }

    // validation
    validateErrorMessage(expectValue) {
        return cy.getByTestId(id.error).should(expectValue);
    }
    validateSuccessMessage(expectValue) {
        return cy.getByTestId(id.success).should(expectValue);
    }
    validateCount(expectValue) {
        return cy.getByTestId(id.count_value).should("contain", expectValue);
    }
    validateSubmitButton(expectValue) {
        return cy.getByTestId(id.submit).should(expectValue);
    }
}