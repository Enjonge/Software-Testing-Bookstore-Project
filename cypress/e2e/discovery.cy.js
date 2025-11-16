// cypress/e2e/discovery.cy.js
describe('Discover App Selectors', () => {
  it('should find book elements and cart functionality', () => {
    cy.visit('/');
    
    // Wait for page to load
    cy.wait(2000);
    
    console.log('=== LOOKING FOR BOOK ELEMENTS ===');
    
    // Look for any book-like elements
    cy.get('div, article, section, li').each(($el, index) => {
      const text = $el.text();
      const classes = $el.attr('class') || '';
      const id = $el.attr('id') || '';
      
      // If it looks like a book card (has book-related text)
      if (text.match(/book|novel|read|author|price|\$/i)) {
        console.log(`Potential book element ${index}:`, {
          tag: $el.prop('tagName'),
          classes: classes,
          id: id,
          text: text.substring(0, 100) // First 100 chars
        });
      }
    });

    console.log('=== LOOKING FOR CART ELEMENTS ===');
    
    // Look for cart/basket elements
    cy.get('*').each(($el, index) => {
      const text = $el.text();
      if (text.match(/cart|basket|bag|checkout/i)) {
        console.log(`Cart-related element ${index}:`, {
          tag: $el.prop('tagName'),
          text: text.trim()
        });
      }
    });

    // Take a screenshot for visual inspection
    cy.screenshot('app-layout');
  });
});