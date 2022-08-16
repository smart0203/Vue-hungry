describe('Testing Booking', () => {
  it('Membuka situs', () => {
    cy.visit('/en/restaurants/copper-buffet-the-sense-pinklao')
    //cy.wait(2000)
    cy.get(':nth-child(1) > [tnc=""] > :nth-child(1) > .px-2 > .button-column > .button-column-inner > .select-package-button').click()

    cy.wait(6000)
    cy.get('#adult-selection-2').click()
    cy.get('#confirm-adult-button').scrollIntoView({ duration: 500 }).click({ force: true })

    cy.wait(8000)
    cy.get('[aria-label="October 31, 2020"]').scrollIntoView({ duration: 500 }).click({ force: true })

    cy.wait(8000)
    cy.contains('18:30').click()

    cy.wait(10000)
    cy.get(':nth-child(1) > :nth-child(1) > .px-4 > .justify-between > .py-1').click()

    //mengisi form konfirmasi
    cy.wait(6000)
    cy.get('.flex-wrap > :nth-child(2) > .items-center > .flex')
      .type('Eka Puji').should('have.value', 'Eka Puji')

    cy.wait(2000)
    cy.get(':nth-child(3) > .pb-2 > .iti > .flex')
      .type('839391612').should('have.value', '839391612')

    cy.get(':nth-child(4) > .pb-2 > .flex')
      .type('Eka@gmail.com').should('have.value', 'Eka@gmail.com')

    cy.get('.flex-wrap > .mb-3 > .flex')
      .type('sedang').should('have.value', 'sedang')

    cy.get('#create-booking-button').scrollIntoView({ duration: 1000 })
    cy.get(':nth-child(2) > :nth-child(2) > :nth-child(1) > :nth-child(1) > .items-center > .flex')
      .type('Eka').should('have.value', 'Eka')

    cy.get(':nth-child(2) > :nth-child(2) > :nth-child(2) > .items-center > .iti > .flex')
      .type('839391612').should('have.value', '839391612')

    cy.get('#creditcard-payment-method-button').scrollIntoView({ duration: 1000 }).click()
    cy.get('#create-booking-button').scrollIntoView({ duration: 1000 })

    //mengisi kartu kredit
    //   cy.get('.mt-3 > :nth-child(1) > .flex-col > :nth-child(1) > :nth-child(2) > .flex > .w-full')
    //   .type('4987654321098769').should('have.value','4987 6543 2109 8769')

    //   cy.get('.mr-2 > :nth-child(1) > .border-b > .w-full')
    //   .type('Eka').should('have.value','Eka')

    //   cy.get('.flex.mt-4 > :nth-child(1) > :nth-child(2) > .border-b > .w-full')
    //   .type('0521').should('have.value','05/21')  

    //   cy.get(':nth-child(3) > :nth-child(1) > .relative > .w-full')
    //   .type('111').should('have.value','111')

    //   cy.get('#create-booking-button').click({force: true})

  })
})