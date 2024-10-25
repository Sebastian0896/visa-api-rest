import { request, response } from "express";
import { dbConnection } from "../db/conn.js";

import sql from "mssql";


export const getApplicants = async (req = request, res) => {

    const pool = await dbConnection();

    const result = await pool.request().query("SELECT * FROM Applicant")

    res.json(result.recordset)
}
export const getApplicant = async (req = request, res = response) => {
 
    const pool = await dbConnection();
    //console.log(req.params.id)

    const result = await pool.request()
                                .query(`SELECT * FROM Applicant WHERE ApplicantID = ${req.params.id}` )

    //console.log(result)
    if(result.rowsAffected[0] === 0){

        return res.status(404).json({
            msg: "Este aplicante no existe en la base de datos."
        })
    }
    res.status(200).json(result.recordset)
}



export const postApplicant = async (req = request, res) => {

    
    const pool = await dbConnection();
    const result = await pool
    .request()
    .input("ApplicantName", sql.VarChar, req.body.ApplicantName)
    .input("ApplicantLastName", req.body.ApplicantLastName)
    .input("ApplicantAlias", req.body.ApplicantAlias)
    .input("ApplicantEmail", req.body.ApplicantEmail)
    .input("ApplicantKey", req.body.ApplicantKey)
    .input("ApplicantAddress", req.body.ApplicantAddress)
    .input("ApplicantPhone", req.body.ApplicantPhone)
    .input("ApplicantPostalCode", req.body.ApplicantPostalCode)
    .input("ApplicantBirth", req.body.ApplicantBirth)
    .input("ApplicantApplicationExpired", req.body.ApplicantApplicationExpired)
    .query("INSERT INTO Applicant (ApplicantName, ApplicantLastName, ApplicantAlias, ApplicantEmail, ApplicantKey, ApplicantAddress, ApplicantPhone, ApplicantPostalCode, ApplicantBirth, ApplicantApplicationExpired) VALUES (@ApplicantName, @ApplicantLastName, @ApplicantAlias, @ApplicantEmail, @ApplicantKey, @ApplicantAddress, @ApplicantPhone, @ApplicantPostalCode, @ApplicantBirth, @ApplicantApplicationExpired) ");
    console.log(result)
    if(result.rowsAffected[0] === 0){
        return res.status(400).json({
            msg: "No se pudo agregar el aplicante...!"
        })
    }
    res.status(200).json(result.recordset)
}