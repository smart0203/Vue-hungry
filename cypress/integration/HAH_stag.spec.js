describe("Testing Order", () => {
  it("Membuka situs", () => {
    cy.visit("/en/restaurants/copper-buffet-the-sense-pinklao");
    cy.get(".restaurant-name").should(
      "have.text",
      " Copper Buffet The Sense Pinklao Share"
    );
    cy.scrollTo("center");
    cy.get(
      '.delivery-package > .flex-col.w-full > :nth-child(1) > [tnc=""] > :nth-child(1) > .px-2 > .button-column > .button-column-inner > .select-package-button'
    )
      .debug()
      .click({ force: true });

    // Pemilihan Menu
    cy.get(
      ":nth-child(2) > .section-body > .flex-wrap > :nth-child(1) > .mr-2 > div.flex > .increase-menu-quantity-button"
    ).click({ force: true });
    cy.get(
      ":nth-child(2) > .section-body > .flex-wrap > :nth-child(2) > .mr-2 > div.flex > .increase-menu-quantity-button"
    ).click({ force: true });
    cy.get(
      ":nth-child(3) > .section-body > .flex-wrap > :nth-child(1) > .mr-2 > div.flex > .increase-menu-quantity-button"
    )
      .scrollIntoView({ duration: 1000 })
      .click({ force: true });
    cy.get(
      ":nth-child(4) > .section-body > .flex-wrap > :nth-child(1) > .mr-2 > div.flex > .increase-menu-quantity-button"
    ).click({ force: true });

    // Detail Pilihan Menu
    cy.get(".mx-2 > :nth-child(1) > .justify-between > div").should(
      "have.text",
      " Happy Premium - 4 Menu x1"
    );
    cy.get(".mx-2 > :nth-child(1) > .justify-between > :nth-child(2)").should(
      "have.text",
      "555฿"
    );
    cy.get(":nth-child(1) > .text-xs > .text-red-dark").should(
      "have.text",
      "2/2"
    );
    cy.get(":nth-child(1) > .text-xs > .flex-auto").should(
      "have.text",
      "Group A(select 2 portions)"
    );
    cy.get(":nth-child(1) > :nth-child(2) > .flex-auto").should(
      "have.text",
      " Shrimp Tempura (3 Pieces) "
    );
    cy.get(":nth-child(1) > :nth-child(2) > .text-right").should(
      "have.text",
      "1"
    );
    cy.get(":nth-child(2) > :nth-child(1) > :nth-child(3) > .flex-auto").should(
      "have.text",
      " Hot Tulip Wings (Deep Fried Chicken Wings) (4 Pieces) "
    );
    cy.get(":nth-child(1) > :nth-child(3) > .text-right").should(
      "have.text",
      "1"
    );
    cy.get(":nth-child(2) > .text-xs > .flex-auto").should(
      "have.text",
      "Group B(select 1 portion)"
    );
    cy.get(":nth-child(2) > .text-xs > .text-red-dark").should(
      "have.text",
      "1/1"
    );
    cy.get(":nth-child(2) > .text-gray-700 > .flex-auto").should(
      "have.text",
      " BBQ Chicken Steak "
    );
    cy.get(":nth-child(2) > .text-gray-700 > .text-right").should(
      "have.text",
      "1"
    );
    cy.get(":nth-child(3) > .text-xs > .flex-auto").should(
      "have.text",
      "Group C(select 1 portion)"
    );
    cy.get(":nth-child(3) > .text-xs > .text-red-dark").should(
      "have.text",
      "1/1"
    );
    cy.get(":nth-child(3) > .text-gray-700 > .flex-auto").should(
      "have.text",
      " Chocolate Lava with Raspberry Sauce "
    );
    cy.get(":nth-child(3) > .text-gray-700 > .text-right").should(
      "have.text",
      "1"
    );
    cy.get("#confirm-package-button").click();

    // Halaman Pemilihan Tanggal dan Jam
    cy.wait(2000)
    cy.get(':nth-child(3) > .mb-2').click()
    cy.wait(2000)
    cy.get('.today').next().click()
    cy.wait(2000)
    cy.get('#booking-body').contains('16:30').click()

    // Halaman Konfirmasi Pembayaran
    cy.wait(2000);
    cy.get(".flex-wrap > :nth-child(2) > .items-center > .flex")
      .type("Eka Puji")
      .should("have.value", "Eka Puji");
    cy.get(".iti > .flex")
      .type("839391613")
      .should("have.value", "839391613");
    cy.get(":nth-child(4) > .pb-2 > .flex")
      .type("Eka@gmail.com")
      .should("have.value", "Eka@gmail.com");
    cy.get(".flex-wrap > .mb-3 > .flex")
      .type("Pedas")
      .should("have.value", "Pedas");

    // Pickup
    cy.get("#self-pickup-button").click();

    // Summary Charge
    cy.get('.pt-2 > .mb-2.text-red-dark').should('have.text', ' 2020-12-09 at 16:30 ')
    cy.get('.flex-col > .flex > .flex-auto').should('have.text', ' Happy Premium - 4 Menu X1(555฿)')
    cy.get(':nth-child(2) > .flex-col > .flex > .text-base').should('have.text', ' 555฿ ')
    cy.get('.mb-2.font-black > :nth-child(2) > .text-base').should('have.text', ' 555฿ ')

    // Kartu Kredit
    cy.get("#creditcard-payment-method-button")
      .scrollIntoView({ duration: 1000 })
      .click();
    cy.get('input[name="card number"]')
      .type("4987654321098769")
      .should("have.value", "4987 6543 2109 8769");
    cy.get(".mr-2 > :nth-child(1) > .border-b > .w-full")
      .scrollIntoView({ duration: 1000 })
      .type("Eka")
      .should("have.value", "Eka");
    cy.get('input[name="card exp"]')
      .type("0521")
      .should("have.value", "05/21");
    cy.get('input[name="security code"]')
      .type("111")
      .should("have.value", "111");
    cy.get("#create-booking-button").click({ force: true });
    cy.wait(15000);

    // Landing Page
    //cy.get('.mx-2 > :nth-child(1) > .text-red-dark').should('have.text', '518630')
    cy.get('.mr-auto > :nth-child(1) > div.font-black').should('have.text', ' Your delicious food will be ready to pickup at 16:30 ')
    cy.get('.mx-2 > .w-full > :nth-child(1) > :nth-child(3)').should('have.text', 'Eka Puji')
    cy.get('.w-full > :nth-child(2) > :nth-child(3)').should('have.text', 'Eka@gmail.com')
    cy.get('.w-full > :nth-child(3) > :nth-child(3)').should('have.text', '+66839391613')
    cy.get(':nth-child(4) > :nth-child(3) > div').should('have.text', '2020-12-09 at 16:30')
    cy.get(':nth-child(5) > :nth-child(3)').should('have.text', 'Copper Buffet The Sense Pinklao')
    cy.get('.w-full > :nth-child(6) > :nth-child(3)').should('have.text', 'self pick up')
    cy.get(':nth-child(7) > :nth-child(3)').should('have.text', 'Hungry@Home')
    cy.get(':nth-child(8) > :nth-child(3)').should('have.text', 'Pedas (Shrimp Tempura (3 Pieces) X1,Hot Tulip Wings (Deep Fried Chicken Wings) (4 Pieces) X1,BBQ Chicken Steak X1,Chocolate Lava with Raspberry Sauce X1)')

    // Button Share dan Sign Up Now
    cy.get(":nth-child(1) > .inline-block").should(
      "have.text",
      " Share Order "
    );
    cy.get("#landing-signup-cta-button").should(
      "have.text",
      " Sign up now to earn 5 Hungry Points for this order "
    );
  });
});
