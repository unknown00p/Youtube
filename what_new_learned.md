Date: 4-01-2026

topic --> Pooling DataBase connection (mongoDB with mongoose)

Problem: the problem is when we connect to the Database and get a query req, we first create a connection socket to complete the request. BUT it can only support one query at a time, so if we get 10 users requesting database quering, first query will take (approx 100ms) to get done then second, then third and so on one by one. so the time taken for the 10th query will be 1000ms(10 times) more. which is straight up slow as turtle and if request grows more it will be disater

solution: with Pooling what we do is create multiple connection sockets inside pool lets say we have maximum 10 connection sockets, when we get 10 quering request(each with 100ms resolving time) from user. we can assign each connection socket to do the work for each requests so every one of 10 request is getting handled by each connection sockets, so time taken to resolve all request is around 100ms. and even if we get more request then maximum socket connection they can simples start resolving the later query after they get done by previous one.