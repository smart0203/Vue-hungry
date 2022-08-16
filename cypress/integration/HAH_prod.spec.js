describe("Testing Order", () => {
  it("Membuka situs", () => {
    cy.visit("/en/restaurants/copper-buffet-delivery-bangkok");
    cy.get(".restaurant-name").should(
      "have.text",
      " Copper Buffet (Delivery) Share"
    );

    cy.get(
      ':nth-child(1) > [tnc=""] > :nth-child(1) > .px-2 > .button-column > .button-column-inner > .select-package-button'
    ).click();
    cy.get(
      ":nth-child(2) > .section-body > .flex-wrap > :nth-child(1) > .mr-2 > div.flex > .increase-menu-quantity-button"
    ).click();
    cy.get(
      ":nth-child(2) > .section-body > .flex-wrap > :nth-child(2) > .mr-2 > div.flex > .increase-menu-quantity-button"
    ).click();

    cy.get(
      ":nth-child(3) > .section-body > .flex-wrap > :nth-child(1) > .mr-2 > div.flex > .increase-menu-quantity-button"
    )
      .scrollIntoView({ duration: 1000 })
      .click({ force: true });

    cy.get(
      ":nth-child(4) > .section-body > .flex-wrap > :nth-child(1) > .mr-2 > div.flex > .increase-menu-quantity-button"
    ).click({ force: true });

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
    cy.wait(1000);

    cy.get(":nth-child(3) > .mb-3").click();
  });
});
