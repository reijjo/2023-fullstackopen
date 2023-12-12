describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    const user = {
      username: "reiska",
      password: "salainen",
      name: "Repe Wow",
    };

    const user2 = {
      username: "testiukko",
      password: "salainen",
      name: "Testi Ukko",
    };

    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.request("POST", "http://localhost:3003/api/users", user2);

    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("reiska");
      cy.get("#password").type("salainen");
      cy.get("#login-button").click();

      cy.contains("Repe Wow logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("reiska");
      cy.get("#password").type("salainen2");
      cy.get("#login-button").click();

      cy.get(".error")
        .should("contain", "wrong credentials")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");

      cy.get("html").should("not.contain", "Repe Wow logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.get("#username").type("reiska");
      cy.get("#password").type("salainen");
      cy.get("#login-button").click();

      // cy.contains("Repe Wow logged in");
    });

    it("5.19-5.21, A blog can be created", function () {
      // 5.19
      cy.contains("new blog").click();

      cy.get("#title").type("cypress title");
      cy.get("#author").type("cypress author");
      cy.get("#url").type("cypress url");
      cy.get("#create-button").click();

      cy.contains("cypress author");

      // 5.20
      cy.get("#show-blog").click();
      cy.contains("likes 0");

      cy.get("#like-button").click();
      cy.contains("likes 1");

      // 5.21
      cy.reload();
      cy.get("#show-blog").click();
      cy.get("#main").should("contain", "cypress author");

      cy.contains("remove").click();
      // cy.wait(5000);
      cy.get("html").should("not.contain", "cypress author", {});
      cy.contains("logout").click();
    });

    describe("5.22, 5.23", function () {
      it("remove button only for blog creator", function () {
        cy.contains("new blog").click();

        cy.get("#title").type("cypress title");
        cy.get("#author").type("cypress author");
        cy.get("#url").type("cypress url");
        cy.get("#create-button").click();

        cy.contains("cypress author");

        cy.contains("logout").click();

        cy.get("#username").type("testiukko");
        cy.get("#password").type("salainen");
        cy.get("#login-button").click();

        cy.get("#show-blog").click();
        cy.get(".titleAuthor").should("not.contain", "remove");
      });

      it("blog with most likes on top", function async() {
        cy.contains("new blog").click();

        cy.get("#title").type("cypress title");
        cy.get("#author").type("cypress author");
        cy.get("#url").type("cypress url");
        cy.get("#create-button").click();

        cy.get("#show-blog").click();

        cy.get("#new-blog").click();

        cy.get("#title").type("cypress title2");
        cy.get("#author").type("cypress author2");
        cy.get("#url").type("cypress url2");
        cy.get("#create-button").click();

        cy.contains("hide").click();

        cy.get(".titleAuthor").eq(0).should("not.contain", "title2");
        cy.get(".titleAuthor").eq(1).should("contain", "title2");

        cy.get(".titleAuthor").eq(1).contains("view").click();

        cy.get("#like-button").click();

        cy.get(".titleAuthor").eq(0).should("contain", "title2");
      });
    });
  });
});
