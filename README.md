# gulp-app-build-tasks
This module will add standard gulp tasks to start building a web application.

## Minimum npm version
The minimum npm version required is 3 because they started supporting the flat dependencies structure.

## Gulp Tasks
| Main tasks                | Description |
|---                        |---          |
| **build**                 | Generate a dist folder with all the project built |
| **serve**                 | Run the project and watch files modifications |
| **serve:dist**            | Generate a dist folder, run the project and watch files modifications |
| **serve:e2e**             | Run the project and launch e2e tests |
| **serve:e2e-dist**        | Generate a dist folder, run the project, watch files modifications, launch e2e tests |
| **start**                 | [alias **serve**] Used by **Visual Studio Code** |
| **test**                  | Run unit tests once |
| **test:auto**             | Run unit tests on each files modifications |
| **protractor:src**        | Run e2e tests once |
| **protractor:dist**       | Generated a dist folder and run e2e tests once |
| **protractor**            | [alias **protractor:src**] |

### Sub tasks
- **scripts**
- **inject**
- **partials**
- **html**
- **fonts**
- **other**
- **clean**
- **watch**
- **webdriver-update**
- **webdriver-standalone**

## File structure
| Path                                       | Description |
|---                                         |---          |
| /app/\*\*/*.{supported file formats}       | Application related code    |
| /app/\*\*/*.spec.js                        | [Optional] Application related unit tests |
| /components\*\*/*.{supported file formats} | [Optional] Components related code |
| /components/\*\*/*.spec.js                 | [Optional] Components related unit tests |
| /e2e/\*\*/*.{po.js, spec.js}               | [Optional] End-to-end unit tests |
| .htaccess                                  | [Optional] Will be copied to the dist folder if present |

## Supported programming languages
Some languages are currently supported on this project and other will be supported
later. They can be used under the **/app** and **/components** folders.

- **Javascript**: .js
- **Css**: .css

### Coming soon

- **Typescript**: .ts
- **Less**: .less

## Unit Tests
[Jasmine 2.3](http://jasmine.github.io/2.3/introduction.html) is used as framework
and [Karma](https://github.com/karma-runner/karma) is used to run tests in different browsers.

## End-to-end Tests
[Jasmine 2.3](http://jasmine.github.io/2.3/introduction.html) is used as framework
and [Protractor](https://github.com/angular/protractor) is used to run tests