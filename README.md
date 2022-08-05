# Atelier API Scalable Microservice | Ratings and Reviews

## Summary

A backend API microservice to provide ratings and reviews data for an existing e-commerce website. Made incremental improvements to improve web traffic throughput (RPS) and response time in order to handle normal web traffic loads

## Database Improvements

- Built aggregate Postgres queries to help reduce database bottlenecking in query times
- Deployed 3 AWS EC2 server instances with load balancing server through NGINX, to increase web traffic throughput from ~100 RPS to ~6000 RPS while maintaining a 0% error rate and an average 60 ms response time.
- Implemented Caching in NGINX to further improve throughput to ~6000 RPS while maintaining response time and 0% error rate. 

## Installation

Step 1: Install dependencies ~ npm install

Step 2: start server ~ npm run server-dev

## Technologies Used

- Setup and Configuration \
  ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
  ![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)

- Back End Development: Node.js, Express.js, PostgreSQL \
  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-SQL-9cf)

- Server Testing: Loader.io, k6 \
  ![k6](https://img.shields.io/badge/k6-local-blue)
  ![Loader.io](https://img.shields.io/badge/loader.io-cloud-blue)

- Deployment & Load Balancing: AWS EC2, Ubuntu, NGINX \
  ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
  ![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)
