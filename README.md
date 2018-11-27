# mock-from-pact

this application will start and persist running a mock server based on a collection of Pact interactions

 it's created as a workaround to [https://github.com/pact-foundation/pact-mock_service/issues/54](https://github.com/pact-foundation/pact-mock_service/issues/54)
 
 the code is nasty but it already supports headers and queries
 
 ## Usage
 on Windows start it using the following command:
  
 `set INTERACTIONS=./interactions.js&set PORT=3003&& yarn start`
 
 on Unix call:
 
 `INTERACTIONS=./interactions.js PORT=3003 yarn start`

You can also run mock-from-pact's npm scripts even when it's installed in node_modules by calling (npm's equivalent of yarn --cwd is npm explore) 
   
  `INTERACTIONS=./interactions.js PORT=3003 yarn --cwd node_modules/mock-from-pact/ run start`
 
 If you don't want to use pm2 to start/stop the server then replace 'yarn start' with 'yarn start:raw'
 
 this code is licensed under the MIT license placed in the LICENSE file