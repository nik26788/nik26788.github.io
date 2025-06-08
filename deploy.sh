#!/usr/bin/env sh
set -e

pnpm run docs:build

cd .vitepress/dist

# if you want to deploy the code in your own domain:
# echo 'www.example.com' > CNAME

time=$(date "+%Y-%m-%d %H:%M:%S") 

git init
git add -A
git commit -m "deployed at $time"

# push the code to github
git push -f git@github.com:nik26788/nik26788.github.io.git master:gh-pages

cd -
rm -rf .vitepress/dist

echo "repo: https://github.com/nik26788/nik26788.github.io"
echo "docs: https://nik26788.github.io"


