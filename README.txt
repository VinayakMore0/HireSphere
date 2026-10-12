HireSphere MongoDB integration update

Replace these files in your existing HireSphere project root:
- companies.html
- contact.html
- script.js

These files preserve the existing page layout/classes and connect to:
- GET /api/companies
- POST /api/contact

The backend server.js must already be running and expose those endpoints.
Company records are rendered from MongoDB. Contact submissions are posted to the server.
Do not open the HTML files directly with file://; open them through http://localhost:3000/.

For sample company data, use the seed.js file supplied in the previous instructions. Run:
node seed.js

Then:
npm start

Test:
http://localhost:3000/companies.html
http://localhost:3000/contact.html
