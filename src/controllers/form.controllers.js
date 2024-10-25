import { request, response } from "express";
import { dbConnection } from "../db/conn.js";

import sql from "mssql";


export const getForms = async (req = request, res) => {

    const pool = await dbConnection();

    const result = await pool
                        .request()
                        .query("SELECT * from DS160Form")
    res.json(result.recordset)
}

export const getForm = async (req = request, res = response) => {
    
    const pool = await dbConnection();
    //console.log(req.params.id)
    
    const result = await pool.request()
    .query(`SELECT * FROM DS160Form WHERE DS160Code = '${req.params.id}'` )
    
    //console.log(result)
    if(result.rowsAffected[0] === 0){
        
        return res.status(404).json({
            msg: "Este aplicante no existe en la base de datos."
        })
    }
    console.log(result)
    res.status(200).json(result.recordset)
}

export const postForm = async (req = request, res = response) => {

    console.log(req.body)
    const pool = await dbConnection();
    const result = await pool
                            .request()
                            .input("DS160Code", req.body.DS160Code)
                            .input("StartedFilledForm", req.body.StartedFilledForm)
                            .input("EndedFilledForm", req.body.EndedFilledForm)
                            .input("RecoverForm", req.body.RecoverForm)
                            .input("IsPaid", req.body.IsPaid)
                            .query("INSERT INTO DS160Form (DS160Code, StartedFilledForm, EndedFilledForm, RecoverForm, IsPaid) VALUES (@DS160Code, @StartedFilledForm, @EndedFilledForm, @RecoverForm, @IsPaid)");


    console.log(result)
    if(req.body){
        return res.status(200).json({
            msg: "Formulario creado con éxito"
        })
    }else{
        res.status(400).json({
            error: "Faltan datos requeridos"
        })
    }

    if (result.recordset[0].count > 0) {
        // Si el id ya está registrado, rechaza la solicitud
        return res.status(400).json({ error: 'El ID ya está en uso' });
        }

    if(result.rowsAffected[0] === 0){
        return res.status(400).json({
            msg: "No se pudo agregar el aplicante...!"
        })
    }
    res.status(201).json(result.recordset)
}