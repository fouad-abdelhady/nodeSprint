1- To perform product and category operations you need to login or register and use the token in the response to do the operations
2- There are two types of users  customer and admin, and the it must be specified in the register request body (plz look at apiTester.rest for details)
3- The customer can read categories and products only. The admin has a full access.
4- Plz note that the token will be expired in 5 mints, to get new token you need to pass the refresh token to the freshToken api(apTester.rest).
