describe('Testing Login', () => {
  it('Membuka situs', () => {
    cy.visit('/en/restaurants/copper-buffet-the-sense-pinklao')
    cy.wait(1000)
    cy.get('.restaurant-name').should('have.text', ' Copper Buffet The Sense Pinklao ')
    cy.get('#navbar-login-button').click()

    // Isi Form Login
    cy.get('.mb-3 > .flex-auto')
      .type('farah27@gmail.com').should('have.value', 'farah27@gmail.com')
    cy.get('[type=password]')
      .type('farah').should('have.value', 'farah')

    cy.get('#login-submit-button').click()
    cy.wait(5000)
    cy.get('.username-section > .px-4').should('have.text', " Farah ")
  })
})
