# SeeVee

## Giving You Long-Lived, Immutable Credentials 
### Link to Public Repo: https://github.com/darreyyll/seevee.git
------

### What is SeeVee?

SeeVee allows you to create long-lived, trusted credentials to replace your resume or CV. Make claims, get those claims verified and preserve your credentials for life on the Ethereum Blockchain. 

Anyone can make an account and start collecting credentials today. 



### How To Use SeeVee

RUNNING DRIZZLE APP (TERMINAL CMDS):

- <u>In a command prompt:</u>
  ganache-cli -p 8545 -m “”	
- <u>In a second command prompt:</u>
  Cd to SeeVee/truffle folder
  truffle compile
  truffle migrate				(“truffle migrate —reset” to redeploy/remigrate) 
  (migration is to port 8545 - to match metamask)

- <u>In a third command prompt:</u>
  - For Windows OS:
    Delete node_modules folder		(add to .gitignore, so don’t have to manually delete)
    Delete package-lock.json		(need to delete, if not it will install dependencies based on MACOS)
    npm install && npm run serve				(installs dependencies/node_modules)
  - For MAC OS:
    npm run serve 				
- <u>In browser:</u>
  http://localhost:8080/ 
  Switch to LocalHost 8545 on Metamask
  Import account using ganache-cli’s accounts private keys



#### With this, you're ready to go! Enjoy SeeVee!
