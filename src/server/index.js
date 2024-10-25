import Express from "express";
import cors from "cors";
import {applicantRouter, formRouter} from "../routes/index.js";
import { dbConnection } from "../db/conn.js";



class Server {

    constructor(){
        this.app = Express();
        this.port = 5000 || process.env.PORT;



        //Llamar de funciones o metodos
        this.connection();
        this.middlewares();
        this.routes();
    }

    //Crear de funciones o metodos

    //middlewares or fileConfig

    //dbConnection
    async connection(){
        await dbConnection();
    }

    //middlewares
    middlewares(){
        this.app.set("json spaces", 2)
        this.app.use(cors())
        this.app.use(Express.json());
    }

    //routes
    routes(){
        this.app.use("/", applicantRouter)
        this.app.use("/", formRouter)
    }

    listen(){
        this.app.listen(this.port, () => console.log(`Server is running on port: ${this.port}`));
    }
}


export  default Server;