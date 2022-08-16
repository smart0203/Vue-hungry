describe('Testing Register', () => {
  it('Membuka situs', () => {
    cy.visit('/en/restaurants/copper-buffet-the-sense-pinklao')
    cy.get('.restaurant-name').should('have.text', ' Copper Buffet The Sense Pinklao ')
    cy.get('#navbar-register-button').click()

    // Isi Form Register
    cy.get(':nth-child(1) > :nth-child(1) > .w-full > .flex-auto')
      .type('ab').should('have.value', 'ab')
    cy.wait(1000)
    cy.get('#phone-input')
      .type('839391612').should('have.value', '839391612')
    cy.get(':nth-child(3) > :nth-child(1) > .w-full > .flex-auto')
      .type('ab1@gmail.com').should('have.value', 'ab1@gmail.com')
    cy.get('[type=password]')
      .type('aaaaaa').should('have.value', 'aaaaaa')

    cy.get('#submit-signup-button').click()
    cy.wait(5000)
    cy.get('.username-section > .px-4').should('have.text', ' ab ')
  })
})
