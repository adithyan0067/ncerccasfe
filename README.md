# Canteen Pre-Order – GitHub Pages + Firebase
web url:-https://adithyan0067.github.io/final-cafe/
Static site (HTML/CSS/JS modules) hosted on **GitHub Pages**, using **Firebase** for:
- **Authentication** – email + password for students and the admin
- **Cloud Firestore** – menu, branding, student profiles and orders (shared by everyone)

## Files
- `firebase-config.js` – paste your Firebase web config here (only file you must edit)
- `common.js` – Firebase init + shared helpers (replaces old `data.js`)
- `default-products.js` – starter menu (uploaded from the admin dashboard)
- `firestore.rules` – security rules to paste in the Firebase console
- Page scripts: `login.js`, `register.js`, `menu.js`, `cart.js`, `payment.js`, `upi-payment.js`, `order-confirmation.js`, `orders.js`, `home.js`, `admin.js`, `admin-login.js`

## Firestore data
| Collection | Document | Purpose |
|---|---|---|
| `products` | auto id | menu items (admin writes, everyone reads) |
| `settings` | `site` | college name / logo |
| `users` | user uid | student name, phone, email |
| `orders` | auto id | orders (student creates, admin updates status) |
| `admins` | admin uid | **existence of this doc = admin** (create manually) |

## Run locally
ES modules do not work from `file://`. Use VS Code "Live Server" or `python -m http.server`.

## Deploy
Push everything to the GitHub repo (Pages enabled). In Firebase → Authentication → Settings →
**Authorized domains**, add `YOUR-USERNAME.github.io`.

## Security notes
- The Firebase config is public by design; Firestore rules are what protect data.
- Order totals are computed in the browser. For a real production system, move that to a Cloud Function.

## Demo checkout and payment
Checkout is split into separate screens: `cart.html` collects department, year of study, delivery location, and contact phone; `payment.html` selects cash or UPI; `upi-payment.html` shows the QR, direct Google Pay and Paytm app links, a general UPI fallback, and a required compressed screenshot upload; and `order-confirmation.html` reviews and places the order. Orders remain in the existing `orders` collection; no new collection or Firestore rule is needed. New order documents include extra checkout and payment fields. The admin dashboard can update order status (including Cancelled) and payment status, and can open an uploaded proof image.

To configure branding and UPI, sign in to the admin dashboard and open College branding. Upload the college logo and payment QR image, enter the canteen UPI ID and display name, and select Save branding. The college logo and QR image are stored in the existing site settings document (upload images under 300 KB each). Payment proof is compressed into each order document, so this is intended for a small demo; use Firebase Storage for a production system. The app links launch the selected UPI app when installed and include the order amount and configured UPI ID. The receipt screenshot is required for UPI orders so the admin can review it. This frontend demo cannot verify a bank transaction automatically; admins should verify the payment and mark it Paid. A production Paytm Smart Intent integration requires merchant-side setup and server verification.


The student site includes a compact mobile navigation and responsive menu, checkout, payment, and order cards. Uploading a logo in College branding replaces the fallback icon in the student header across pages.

The homepage hero image can be uploaded or hidden from Admin → College branding. Menu favourites are saved in this browser's local storage and do not create or update Firestore documents.
