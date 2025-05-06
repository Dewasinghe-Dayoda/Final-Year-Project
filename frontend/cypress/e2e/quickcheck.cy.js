describe('QuickCheck Flow', () => {
    it('completes prediction flow', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('test@skinproscan.com');
      cy.get('input[name="password"]').type('Test123!');
      cy.contains('Login').click();
  
      cy.visit('/quickcheck');
      cy.get('input[type="file"]').attachFile('cellulitis.jpg');
      cy.contains('Check Skin Condition').click();
      cy.contains('Cellulitis', { timeout: 10000 }).should('exist');
    });
  });