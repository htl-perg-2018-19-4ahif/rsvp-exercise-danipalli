import {CREATED, BAD_REQUEST, UNAUTHORIZED} from "http-status-codes";
import * as loki from "lokijs";
import * as express from "express";
import * as basicAuth from "express-basic-auth";

let title = "Hacking council";
let location = "Haag";
let date: Date = new Date(Date.now());

const db = new loki("loki.json");
let guests = db.addCollection('guests')

let server = express();
server.use(express.json())

const adminFilter = basicAuth({ users: { 'admin': 'admin' } });

const port = 8080;
server.listen(port, function() {
  console.log(`API is listening on port ${port}`);
});

server.get("/party", (request, response) => {
    response.send({ title: title,
                    location: location,
                    date: date
    });
});

server.get("/guests", adminFilter, (request, response) => {
    response.send(guests.find());
});

server.post("/register", (request, response) => {
    if(request.body.firstName && request.body.lastName){
        if(guests.count() >= 10){
            response.status(UNAUTHORIZED).send("Sorry too many users in party!");
        }else{
            guests.insert({firstName: request.body.firstName, lastName: request.body.lastName});
            response.status(CREATED).send("Created User");
        }
    }else{
        response.status(BAD_REQUEST).send("Missing a part of your name!")
    }
    
});