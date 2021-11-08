#!/bin/zsh
source ~/.zshrc 

echo "Deploying back end"
heroku git:remote -a isp-speed-api
# git remote set-url heroku https://git.heroku.com/isp-speed-api
heroku buildpacks:clear
git subtree push --prefix backend heroku master
heroku ps:scale web=1
cat backend/.env.production | xargs heroku config:set