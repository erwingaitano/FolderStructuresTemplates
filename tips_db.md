# DROP DATABASE

- Stop the app.
- > dropdb DATABASE_NAME 
  [](If dropdb is not defined, execute: > source ~/.profile)

# IMPORT DATABASE FROM HEROKU TO LOCALHOST

https://devcenter.heroku.com/articles/heroku-postgresql#pg-push-and-pg-pull

- Get name of database: 
  > heroku pg:psql --app herokuAppName [](Eg. DATABASE_URL)
- > heroku pg:pull DATABASE_URL mylocaldb --app herokuAppName