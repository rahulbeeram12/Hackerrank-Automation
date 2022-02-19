# Hacker-Rank - Automation
Developed a script using Puppeteer which automates the process of login and adding multiple moderators to multiple contests in Hackerrank.The purpose of writing this script was to get familiar with automation and async-await in Javascript, while having a little fun

## TECH STACK USED
 -  JAVASCRIPT
 -  NPM Modules
    -  Minimist--> Takes command line arguments
    -  Puppeteer--> For automation

## TO RUN THIS ON YOUR LOCAL
   First fork this to your profile, then clone it to your desktop
   
   Then install libraries 
   ```bash
  npm install minimist
  npm install puppeteer
  ```
  
  To run this project first change username and password to your hackerrank account in config.json file and run the below command
  
  ```bash
  node script.js --url="https://www.hackerrank.com" --config="config.json"
 ```
