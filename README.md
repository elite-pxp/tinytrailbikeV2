# TinyTrail Bikes

A simple static children’s bike shop with working pages, cart, checkout demo, and payment link integration.

## Pages included

- Home: `index.html`
- Shop: `shop.html`
- Product detail: `product.html`
- Cart: `cart.html`
- Checkout: `checkout.html`
- Thank-you page: `thank-you.html`
- About: `about.html`
- FAQ: `faq.html`
- Contact: `contact.html`
- Policies: `policies.html`

## Payment setup

Open:

`assets/js/config.js`

Replace these demo links with your real payment links:

```js
stripePaymentLink: "https://buy.stripe.com/test_replace_this_link",
paypalPaymentLink: "https://www.paypal.com/ncp/payment/replace-this-link",
```

Stripe setup:

1. Create a Stripe account.
2. Create a Payment Link for the bike product.
3. Set the success page to your live website thank-you page.
4. Paste the Stripe Payment Link in `assets/js/config.js`.

PayPal setup:

1. Create a PayPal business account.
2. Create a PayPal payment link or button.
3. Paste the link in `assets/js/config.js`.

## GitHub Pages publishing

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Go to Settings, Pages.
4. Select the main branch and root folder.
5. Save and wait for the live page link.

## Vercel publishing

1. Create a Vercel account.
2. Choose Add New Project.
3. Import your GitHub repo.
4. Keep the build settings empty because this is a static site.
5. Deploy.

## Editing products

Open:

`assets/js/products.js`

Change product names, prices, descriptions, sizes, and images.

## Notes before launch

- Replace the sample logo and product illustration with your real assets.
- Replace the support email.
- Replace policies with real business policies.
- Add live Stripe or PayPal payment links.
- Test on mobile before publishing.
