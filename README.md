# Notes App (MERN)

Yes its a simple CRUD app for note taking. This project wasnt really focused on the website itself, rather learning how to develop code in a collaborative environment(employing **gitflow**) and having a mentor(in this case a person from 10pearls) monitor and merge the PRs I raised. 


## Repo structure

You can find a list of feature and bugfix branches, properly named to express what they were used to accomplish. The entire codebase can be found in develop branch, wasn't allowed to push directly or merge into main (standard practice followed in production environments). 

- Frontend: Vite(react)
- Backend:  Express js


Other things that are implemented to mimick a real production environment are: 


### 1. Backend uses Mocha/Chai 
    Implemented unit tests for all major backend apis. Used a separate test database as well to follow the testing standard.

### 2. Frontend testing (Jest) 
    Created mock functions, mock routers and mock data for frontend testing using jest. Helped me learn many status codes and their meanings.

### 3. SonarQube integration   
    After completing the website, employed sonarQube to generate a thorough inspection report for code quality and security vulnerabilities inspection. 

### 4. Structured Logging (Pino)
    Implemented Pino for structured logging. Keeping track of what's happening without cluttering the codebase with console.log statements.

### 5. Rich Text Editing
    Notes support proper formatting - headings, lists, bold, italic, the works. Taking notes in plain text felt a bit outdated.


---
An attempt to practice industry level code development, made possible by 10Pearls   :)