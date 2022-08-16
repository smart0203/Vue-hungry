describe('Testing AYCE', () => {
    it('Membuka Situs', () => {
        cy.visit('/en/restaurants/cafe-claire-by-oriental-residence')
        cy.get('.restaurant-name').should('have.text', ' Cafe Claire by Oriental Residence Share')
        cy.get(':nth-child(1) > [tnc="https://d38lri8pyzrvor.cloudfront.net/uploads/restaurants/tc/image/21/tc.jpg"] > :nth-child(1) > .px-2 > .button-column > .button-column-inner > .select-package-button')
            .click()

        // Halaman Pilih Adult
        cy.get('#adult-selection-2').click()
        cy.get('#confirm-adult-button').click()

        //Halaman Pilih Tanggal dan Jam
        cy.wait(7000)
        cy.get('[aria-label="December 11, 2020"]').click()
        cy.wait(1000)
        cy.get('#booking-body').contains('18:30').click()

        // Halaman Pilih Package
        cy.wait(2000)
        cy.get(':nth-child(1) > .mt-4 > :nth-child(1) > :nth-child(2) > :nth-child(1) > :nth-child(1) > .px-4 > .justify-between > .py-1')
            .click()

        //Halaman Konfirmasi Pembayaran
        cy.get('.flex-wrap > :nth-child(2) > .items-center > .flex').type('Eka Puji').should('have.value', 'Eka Puji')
        cy.wait(500)
        cy.get(':nth-child(3) > .pb-2 > .iti > .flex')
            .type('839391616').should('have.value', '839391616')
        cy.get(':nth-child(4) > .pb-2 > .flex')
            .type('Eka@gmail.com').should('have.value', 'Eka@gmail.com')
        cy.get('.flex-wrap > .mb-3 > .flex')
            .type('Pedas').should('have.value', 'Pedas')

        // Mengisi Form Guest
        cy.get(':nth-child(2) > :nth-child(2) > :nth-child(1) > :nth-child(1) > .items-center > .flex')
            .type('Eka').should('have.value', 'Eka')
        cy.get(':nth-child(2) > :nth-child(2) > :nth-child(2) > .items-center > .iti > .flex')
            .type('839391612').should('have.value', '839391612')
        cy.get('.mt-5 > .mx-4').scrollIntoView({ duration: 1000 })

        // Summary Charge
        cy.get('.pt-2 > .mb-2.text-red-dark').should('have.text', ' 2020-12-11 at 18:30 ')
        cy.get('.flex-col > .flex > .flex-auto').should('have.text', ' Friday-Sunday X2(990฿)')
        cy.get('.flex.mb-2 > .flex-col > .flex > .text-base').should('have.text', ' 1,980฿ ')

        // Voucher
        // cy.get('.mt-2 > [data-v-0d19b2e7=""] > :nth-child(1) > div.flex > .flex-auto')
        //     .type('KHUSUS1').should('have.value', 'KHUSUS1')
        // cy.get('#use-voucher-button').click()


        // Informasi Detail Booking diatas Button Confirm
        cy.get('.mt-4.mb-3 > .mx-3').should('have.text', '  2 Adults \n            | Friday-Sunday 1,980฿ ')
        cy.get('.mt-4.mb-3 > :nth-child(2)').should('have.text', ' Fri 11 Dec at 18:30 ')
        cy.get('#create-booking-button').scrollIntoView({ duration: 1000 }).click({ force: true })

        // Halaman Landing Page
        cy.wait(10000)
        //cy.get('.mx-2 > :nth-child(1) > .text-red-dark').should('have.text', '518140')
        cy.get('.mx-2 > .w-full > :nth-child(1) > :nth-child(3)').should('have.text', 'Eka Puji')
        cy.get('.mx-2 > .w-full > :nth-child(2) > :nth-child(3)').should('have.text', 'Eka@gmail.com')
        cy.get('.w-full > :nth-child(3) > :nth-child(3)').should('have.text', '+66839391616')
        cy.get('.w-full > :nth-child(4) > :nth-child(3)').should('have.text', '2020-12-11 at 18:30')
        cy.get(':nth-child(5) > :nth-child(3) > div').should('have.text', '2 adults ')
        cy.get('.w-full > :nth-child(6) > :nth-child(3)').should('have.text', 'Cafe Claire by Oriental Residence')
        cy.get(':nth-child(7) > :nth-child(3)').should('have.text', '\n      Friday-Sunday 990฿ ราคาสุทธิ/เซ็ต\n      ')
        cy.get(':nth-child(8) > :nth-child(3)').should('have.text', 'Pedas')
        cy.get(':nth-child(15) > :nth-child(3)').should('have.text', 'Eka Puji')
        cy.get(':nth-child(16) > :nth-child(3)').should('have.text', '+66839391616')
        cy.get(':nth-child(17) > :nth-child(3)').should('have.text', 'Eka ')
        cy.get(':nth-child(18) > :nth-child(3)').should('have.text', '+66839391612')

        // Button Modify, Share, dan Sign Up Now
        cy.get(':nth-child(2) > :nth-child(1) > .mr-2').should('have.text', ' Modify Booking ')
        cy.get('a[href*="https://hhstaging.hungryhub.com/share-to-friends.html"]').should('have.text', ' Share Booking ')
        cy.get('#landing-signup-cta-button').should('have.text', ' Sign up now to earn 19 Hungry Points for this booking ')
    })


})