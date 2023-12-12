describe("Note app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);

    const user = {
      name: "Repe Wow",
      username: "reijjo",
      password: "salainen",
    };

    cy.request("POST", `${Cypress.env("BACKEND")}/users`, user);
    cy.visit("");
  });
  it("front page can be opened", function () {
    cy.contains("Notes");
    cy.contains(
      "Note app, Department of Computer Science, University of Helsinki 2023"
    );
  });

  it("login form can be opened", function () {
    cy.contains("log in").click();
  });

  it("user can log in", function () {
    cy.contains("log in").click();
    cy.get("#username").type("reijjo");
    cy.get("#password").type("salainen");
    cy.get("#login-button").click();

    cy.contains("Repe Wow logged in");
  });

  it("login fails with wrong password", function () {
    cy.contains("log in").click();
    cy.get("#username").type("reijjo");
    cy.get("#password").type("einatsaa");
    cy.get("#login-button").click();

    cy.get(".error")
      .should("contain", "wrong credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");

    cy.get("html").should("not.contain", "Repe Wow logged in");
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "reijjo", password: "salainen" });
      // cy.contains("log in").click();
      // cy.get("#username").type("reijjo");
      // cy.get("#password").type("salainen");
      // cy.get("#login-button").click();
    });

    it("a new note can be created", function () {
      cy.contains("new note").click();
      cy.get("input").type("a note created by cypress");
      cy.contains("save").click();
      cy.contains("a note created by cypress");
    });

    describe("and several note exists", function () {
      beforeEach(function () {
        cy.createNote({ content: "first note", important: false });
        cy.createNote({ content: "second note", important: false });
        cy.createNote({ content: "third note", important: false });
        // cy.contains("new note").click();
        // cy.get("input").type("another note cypress");
        // cy.contains("save").click();
      });

      it("other of those can be made important", function () {
        cy.contains("second note").parent().find("button").as("theButton");
        cy.get("@theButton").click();
        cy.get("@theButton").should("contain", "make not important");
      });
    });
  });
});
