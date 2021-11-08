# Internet Speed Monitoring Dashboard

<a href="https://isp-speed.herokuapp.com">Click here to Visit Application</a>

## Background

When I started working from home, It became clear to me how bad my internet connection actually was.
I decided to setup a process for me to monitor the performance of my internet connection while I was experimenting with different Internet Service Provider. I have used Three, EE, Vodafone, Talk Talk etc. I developed this application to help me visualise this data and I was able to get back £20 a month back from my Internet Service Provider by showing they were not meeting the minimum guaranteed speed advertised at the point of sale.

## Implementation

- Setup a process as a cron on my laptop that runs every hour and performs a speed test.
- The results of the speed test are inserted into a SQL database hosted on AWS.
- The Dashboard on the front end is built with React, Recharts and Semantic UI and hosted on AWS amplify.
- The backend evironment is built with Node.js and hosted on AWS amplify. A Simple REST Api is used to communciate with the front end.

## Dashboard View

![alt text](./dahsboard.png)
