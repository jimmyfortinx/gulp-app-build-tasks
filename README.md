# gulp-app-build-tasks
This module will add standard gulp tasks to start building a web application.

## Minimum npm version
The minimum npm version required is 3 because they started supporting the flat dependencies structure.

## File structure
| Path                                       | Description |
|---                                         |-------------|
| /app/\*\*/*.{supported file formats}       | Application related code    |
| /app/\*\*/*.spec.js                        | Application related unit tests |
| /components\*\*/*.{supported file formats} | Components related code |
| /components/\*\*/*.spec.js                 | Components related unit tests |
| /e2e/\*\*/*.{po.js, spec.js}               | End-to-end unit tests |
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