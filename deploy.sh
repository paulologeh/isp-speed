#!/bin/zsh
source ~/.zshrc 

echo "Deploying back end"
heroku git:remote -a isp-speed-api
heroku buildpacks:clear
git subtree push --prefix backend heroku master
heroku ps:scale web=1
cat backend/.env.production | xargs heroku config:set
echo "Deploying front end"
heroku git:remote -a isp-speed
heroku buildpacks:clear
cat frontend/.env.production | xargs heroku config:set
git subtree push --prefix frontend heroku master
echo "Completed deployment"