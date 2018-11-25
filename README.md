# mock-from-pact

this application will start and persist running a mock server based on a collection of Pact interactions

 it's created as a workaround to [https://github.com/pact-foundation/pact-mock_service/issues/54](https://github.com/pact-foundation/pact-mock_service/issues/54)
 
 the code is nasty but it already supports headers and queries
 
 on Windows start it using the following command:
  
 `set MYPATH=./interactions.js&set PORT=3003&& yarn start`
 
 this code is licensed under the MIT license placed in the LICENSE file