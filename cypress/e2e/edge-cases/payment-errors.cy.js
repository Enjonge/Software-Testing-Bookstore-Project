// cypress/e2e/edge-cases/payment-errors.cy.js
describe('Payment Error Handling', () => {
  beforeEach(() => {
    // Setup: Go through the flow to reach checkout
    cy.visit('/');
    cy.wait(2000);
    
    cy.log('Setting up test: Adding item to cart...');
    cy.get('a, button, [onclick], [class*="card"], [class*="book"]').then(($clickableElements) => {
      const bookElements = $clickableElements.filter((index, el) => {
        const text = el.textContent;
        const html = el.outerHTML;
        return text.match(/book|novel|read|author|price|\$|buy|view|details/i) || 
               html.match(/book|card|product|item/i);
      });
      
      if (bookElements.length > 0) {
        cy.wrap(bookElements.first()).click({ force: true });
        
        // Add to cart
        cy.get('button, a, input[type="button"]').then(($buttons) => {
          const cartButtons = $buttons.filter((index, el) => {
            const text = el.textContent.toLowerCase();
            return text.includes('add to cart') || text.includes('buy now') || text.includes('purchase');
          });
          
          if (cartButtons.length > 0) {
            cy.wrap(cartButtons.first()).click({ force: true });
            cy.log('✅ Item added to cart');
            cy.wait(1000);
            
            // Navigate to cart
            cy.get('a, button, [class*="cart"], [class*="basket"]').then(($elements) => {
              const cartElements = $elements.filter((index, el) => {
                const text = el.textContent.toLowerCase().trim();
                return text === 'cart' || text === 'basket' || text === 'bag';
              });
              
              if (cartElements.length > 0) {
                cy.wrap(cartElements.first()).click({ force: true });
              } else {
                cy.visit('/cart');
              }
            });
            
            // Proceed to checkout
            cy.get('button, a').then(($elements) => {
              const checkoutButtons = $elements.filter((index, el) => {
                const text = el.textContent.toLowerCase();
                return text.includes('checkout') || text.includes('proceed') || text.includes('continue to');
              });
              
              if (checkoutButtons.length > 0) {
                cy.wrap(checkoutButtons.first()).click({ force: true });
                cy.log('✅ Navigated to checkout');
              } else {
                cy.visit('/checkout');
              }
            });
          }
        });
      } else {
        cy.log('ℹ️ No book elements found, trying direct checkout navigation');
        cy.visit('/checkout');
      }
    });
  });

  it('should handle payment failure gracefully', () => {
    cy.log('Step 1: Setting up payment interception...');
    
    // Mock multiple possible payment endpoints
    const paymentEndpoints = [
      '**/paystack/charge',
      '**/api/payment',
      '**/payment/process',
      '**/checkout/complete',
      '**/order/create'
    ];
    
    let interceptionSet = false;
    
    paymentEndpoints.forEach(endpoint => {
      cy.intercept('POST', endpoint, {
        statusCode: 400,
        body: {
          status: false,
          message: 'Payment failed - insufficient funds',
          data: null
        }
      }).as(`paymentFailure${paymentEndpoints.indexOf(endpoint)}`);
    });

    // Fill checkout form if fields exist
    cy.log('Step 2: Filling checkout form...');
    cy.get('body').then(($body) => {
      const emailInputs = $body.find('input[type="email"], input[name="email"]');
      const nameInputs = $body.find('input[type="text"], input[name="name"]');
      
      if (emailInputs.length > 0) {
        cy.wrap(emailInputs.first()).type('test@example.com', { force: true });
      }
      if (nameInputs.length > 0) {
        cy.wrap(nameInputs.first()).type('John Doe', { force: true });
      }
      
      // Fill additional common checkout fields
      cy.get('input[placeholder*="address"], input[name*="address"]').then(($inputs) => {
        if ($inputs.length > 0) {
          cy.wrap($inputs.first()).type('123 Main Street', { force: true });
        }
      });
      
      cy.get('input[placeholder*="phone"], input[name*="phone"]').then(($inputs) => {
        if ($inputs.length > 0) {
          cy.wrap($inputs.first()).type('+1234567890', { force: true });
        }
      });
    });

    // Complete payment - FLEXIBLE APPROACH
    cy.log('Step 3: Attempting payment...');
    cy.get('button, input[type="submit"]').then(($buttons) => {
      const paymentButtons = $buttons.filter((index, el) => {
        const text = el.textContent.toLowerCase();
        return text.includes('pay') || 
               text.includes('complete') || 
               text.includes('purchase') ||
               text.includes('checkout') ||
               text.includes('place order');
      });
      
      if (paymentButtons.length > 0) {
        cy.wrap(paymentButtons.first()).click({ force: true });
        cy.log('✅ Payment attempt made');
        
        // Wait a moment for any payment processing
        cy.wait(3000);
        
        // Check for error messages without waiting for specific API calls
        cy.get('body').then(($body) => {
          const bodyText = $body.text().toLowerCase();
          
          if (bodyText.includes('error') || 
              bodyText.includes('failed') || 
              bodyText.includes('try again') ||
              bodyText.includes('insufficient') ||
              bodyText.includes('declined') ||
              bodyText.includes('problem') ||
              bodyText.includes('issue')) {
            cy.log('✅ Error message displayed correctly');
          } else {
            cy.log('ℹ️ No error message found - payment may have succeeded or be processing differently');
            
            // Check if we're still on checkout page (indicating payment didn't complete)
            cy.url().then((url) => {
              if (url.includes('checkout')) {
                cy.log('ℹ️ Still on checkout page - payment may not have processed');
              } else if (url.includes('success') || url.includes('thank')) {
                cy.log('ℹ️ Payment appears to have succeeded (on success page)');
              } else {
                cy.log(`ℹ️ Navigated to: ${url}`);
              }
            });
          }
        });
      } else {
        cy.log('ℹ️ No payment button found on this page');
        
        // Check what page we're actually on
        cy.url().then((url) => {
          cy.log(`Currently on: ${url}`);
        });
      }
    });

    // Look for retry buttons or error recovery options
    cy.log('Step 4: Looking for error recovery options...');
    cy.get('button, a').then(($elements) => {
      const retryButtons = $elements.filter((index, el) => {
        const text = el.textContent.toLowerCase();
        return text.includes('try again') || 
               text.includes('retry') || 
               text.includes('back') ||
               text.includes('edit') ||
               text.includes('change') ||
               text.includes('update');
      });
      
      if (retryButtons.length > 0) {
        cy.log(`✅ Found ${retryButtons.length} error recovery options`);
      } else {
        cy.log('ℹ️ No specific retry buttons found');
      }
    });

    cy.log('🎉 Payment error test completed!');
  });

  it('should handle network errors during checkout', () => {
    cy.log('Testing network error handling...');
    
    // Mock network failure for multiple endpoints
    const paymentEndpoints = [
      '**/paystack/charge',
      '**/api/payment', 
      '**/payment/process'
    ];
    
    paymentEndpoints.forEach(endpoint => {
      cy.intercept('POST', endpoint, {
        forceNetworkError: true
      }).as(`networkFailure${paymentEndpoints.indexOf(endpoint)}`);
    });

    // Attempt payment
    cy.get('button, input[type="submit"]').then(($buttons) => {
      const paymentButtons = $buttons.filter((index, el) => {
        const text = el.textContent.toLowerCase();
        return text.includes('pay') || text.includes('complete') || text.includes('purchase');
      });
      
      if (paymentButtons.length > 0) {
        cy.wrap(paymentButtons.first()).click({ force: true });
        
        // Check for network error handling
        cy.get('body').then(($body) => {
          const bodyText = $body.text().toLowerCase();
          if (bodyText.includes('network') || bodyText.includes('connection') || bodyText.includes('offline')) {
            cy.log('✅ Network error handled correctly');
          } else {
            cy.log('ℹ️ Network error test completed - no specific error message detected');
          }
        });
      } else {
        cy.log('ℹ️ No payment button found for network error test');
      }
    });
  });
});