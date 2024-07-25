import express, { Application, Router, json } from 'express';
import * as cors from 'cors';
import * as http from 'http';
import { MongoClient, Db } from 'mongodb';
import { config } from '../config/config';
import path from "path";
export class App {
  static express?: Application;
  static server: http.Server;
  static mongodb?: Db;
  private client?: MongoClient;
  static peerServer: any;
  dbname: string = config.database.dbname;
  port: number = config.port;
  constructor(options: { apis: { version: string; routers: Router[] }[] }) {
    if (App.express == undefined) {
      App.express = express();
      App.express.use(json());
      App.express.use(cors.default());
      App.express.use((req, res, next) => {
        console.log('\x1b[32m', `${req.method.toUpperCase()} ${req.path}`);
        next();
      });
      App.express.use('/public', express.static(path.join(__dirname, '../public')));
      for (const api of options.apis) {
        for (const router of api.routers) {
          App.express.use(`/api/${api.version}`, router);
        }
      }
    }
    if (App.mongodb == undefined) {
      this.client = new MongoClient('mongodb://127.0.0.1:27017/');
    }
  }
  async start() {
    App.server = new http.Server({}, App.express);
    if (this.client) {
      await this.client.connect();
      App.mongodb = this.client.db(this.dbname);
    }
    App.server?.listen(this.port, () => {
      console.log('server is online http://localhost:5000 successfully');
    });
  }
}