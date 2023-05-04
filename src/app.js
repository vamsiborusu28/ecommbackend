import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();

// default properties of express to make settings

app.use(express.json()); // to make all the requests and responses are in json format only 
app.use(express.urlencoded({extended: true})); // enables the middle ware to use the request
app.use(cors()); //cross-origin resource origin
app.use(cookieParser()); // enable browser cookies




export default app;
