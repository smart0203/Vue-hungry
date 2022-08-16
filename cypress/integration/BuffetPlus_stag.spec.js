describe('Testing Booking Buffet Plus', () => {
  it('Membuka situs', () => {
    cy.visit('/en/restaurants/copper-buffet-the-sense-pinklao')
    cy.get('.restaurant-name').should('have.text', ' Copper Buffet The Sense Pinklao Share')
    cy.get(':nth-child(2) > .mt-4 > .dine-in-package > .flex-col.w-full > :nth-child(1) > [tnc=""] > :nth-child(1) > .px-2 > .button-column > .button-column-inner > .select-package-button').click()

    // Halaman Pilih Adult
    cy.get('#adult-selection-2').click()
    cy.get('#confirm-adult-button').click()

    // Halaman Pilih Tanggal dan Jam
    cy.wait(7000)
    cy.get('.today').next().click()
    cy.wait(1000)
    cy.get('#booking-body').contains('18:30').click()

    // Halaman Pilih Package
    cy.wait(2000)
    cy.get(':nth-child(1) > :nth-child(1) > .px-4 > .justify-between > .py-1').click()

    // Halaman Konfirmasi Pembayaran
    cy.wait(1000)
    cy.get('.flex-wrap > :nth-child(2) > .items-center > .flex')
      .type('Eka Puji').should('have.value', 'Eka Puji')
    cy.get(':nth-child(3) > .pb-2 > .iti > .flex')
      .type('839391612').should('have.value', '839391612')
    cy.get(':nth-child(4) > .pb-2 > .flex')
      .type('Eka@gmail.com').should('have.value', 'Eka@gmail.com')
    cy.get('.flex-wrap > .mb-3 > .flex')
      .type('sedang').should('have.value', 'sedang')

    // Mengisi Form Guest
    cy.get('#create-booking-button').scrollIntoView({ duration: 1000 })
    cy.get(':nth-child(2) > :nth-child(2) > :nth-child(1) > :nth-child(1) > .items-center > .flex')
      .type('Eka').should('have.value', 'Eka')
    cy.get(':nth-child(2) > :nth-child(2) > :nth-child(2) > .items-center > .iti > .flex')
      .type('839391612').should('have.value', '839391612')

    // Summary Charge pada Konfirmasi Pembayaran
    cy.get('.pt-2 > .mb-2.text-red-dark').should('have.text', ' 2020-12-08 at 18:30 ')
    cy.get('.flex-col > .flex > .flex-auto').should('have.text', ' Hungry Hub Exclusive Menus Pack A X2(1,590฿)')
    cy.get(':nth-child(2) > .flex-col > .flex > .text-base').should('have.text', ' 3,180฿ ')
    cy.get('.mb-2.font-black > :nth-child(2) > .text-base').should('have.text', ' 1,590฿ ')
    cy.get(':nth-child(4) > :nth-child(2) > .text-base').should('have.text', ' 1,590฿ ')
    cy.get('#creditcard-payment-method-button').scrollIntoView({ duration: 1000 }).click()
    cy.get('#create-booking-button').scrollIntoView({ duration: 1000 })

    // Kartu Kredit
    cy.get('.mt-3 > :nth-child(1) > .flex-col > :nth-child(1) > :nth-child(2) > .flex > .w-full')
      .type('4987654321098769').should('have.value', '4987 6543 2109 8769')
    cy.get('.mr-2 > :nth-child(1) > .border-b > .w-full')
      .type('Eka').should('have.value', 'Eka')
    cy.get('.flex.mt-4 > :nth-child(1) > :nth-child(2) > .border-b > .w-full')
      .type('0521').should('have.value', '05/21')
    cy.get(':nth-child(3) > :nth-child(1) > .relative > .w-full')
      .type('111').should('have.value', '111')

    // Informasi Detail Booking diatas Button Confirm
    cy.get('.mt-4.mb-3 > .mx-3').should('have.text', '  2 Adults \n            | Hungry Hub Exclusive Menus Pack A 3,180฿ ')
    cy.get('.mt-4.mb-3 > :nth-child(2)').should('have.text', ' Tue 8 Dec at 18:30 ')
    cy.get('#create-booking-button').scrollIntoView({ duration: 1000 }).click({ force: true })

    // Halaman Landing Page
    cy.wait(15000)
    //cy.get('.mx-2 > :nth-child(1) > .text-red-dark').should('have.text','518074')
    cy.get('.mx-2 > .w-full > :nth-child(1) > :nth-child(3)').should('have.text', 'Eka Puji')
    cy.get('.mx-2 > .w-full > :nth-child(2) > :nth-child(3)').should('have.text', 'Eka@gmail.com')
    cy.get('.w-full > :nth-child(3) > :nth-child(3)').should('have.text', '+66839391612')
    cy.get('.w-full > :nth-child(4) > :nth-child(3)').should('have.text', '2020-12-08 at 18:30')
    cy.get(':nth-child(5) > :nth-child(3)').should('have.text', '2 adults ')
    cy.get('.w-full > :nth-child(6) > :nth-child(3)').should('have.text', 'Copper Buffet The Sense Pinklao')
    cy.get(':nth-child(7) > :nth-child(3)').should('have.text', 'Buffet Plus')
    cy.get(':nth-child(8) > :nth-child(3)').should('have.text', 'sedang')
    cy.get(':nth-child(15) > :nth-child(3)').should('have.text', 'Eka Puji')
    cy.get(':nth-child(16) > :nth-child(3)').should('have.text', '+66839391612')
    cy.get(':nth-child(17) > :nth-child(3)').should('have.text', 'Eka ')
    cy.get(':nth-child(18) > :nth-child(3)').should('have.text', '+66839391612')

    // Charged Summary
    cy.get('.flex-col > .flex > .flex-auto').should('have.text', ' Hungry Hub Exclusive Menus Pack A X2(1,590฿)')
    cy.get('.text-base').should('have.text', ' 3,180฿ ')
    cy.get('.px-4 > :nth-child(3) > .text-red-dark').should('have.text', ' 1,590฿ ')
    cy.get('.px-4 > :nth-child(4) > .text-red-dark').should('have.text', ' 1,590฿ ')

    // Button Modify, Share, dan Sign Up Now
    cy.get(':nth-child(2) > :nth-child(1) > .mr-2').should('have.text', ' Modify Booking ')
    cy.get('a[href*="https://hhstaging.hungryhub.com/share-to-friends.html"]').should('have.text', ' Share Booking ')
    cy.get('#landing-signup-cta-button').should('have.text', ' Sign up now to earn 31 Hungry Points for this booking ')
  })
})