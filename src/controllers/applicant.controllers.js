import { request, response } from "express";
import { dbConnection } from "../db/conn.js";

import sql from "mssql";


export const getApplicants = async (req = request, res) => {

    const pool = await dbConnection();

    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;

    // Consulta para obtener el número total de registros
    const totalResult = await sql.query(`SELECT COUNT(*) AS total FROM Applicant`);
    const totalRecords = totalResult.recordset[0].total;

    // Calcular el número total de páginas
    const totalPages = Math.ceil(totalRecords / limit);

    const result = await pool
                        .request()
                        .query(`SELECT a.ApplicantID, a.ApplicantName, a.ApplicantLastName, a.ApplicantAlias, a.ApplicantEmail, a.ApplicantApplicationExpired, f.DS160Code FROM Applicant a JOIN DS160Form f ON a.Formcode = f.DS160Code ORDER BY ApplicantID OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`)
    res.json({
        totalPages,
        limitPerPage: limit,
        pageNumber: page,
        applicants: result.recordset
    })
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
    console.log(result)
    res.status(200).json(result.recordset)
}




export const postApplicant = async (req = request, res) => {

    console.log(req.body)
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
    .input("FormCode", req.body.FormCode)
    .query("INSERT INTO Applicant (ApplicantName, ApplicantLastName, ApplicantAlias, ApplicantEmail, ApplicantKey, ApplicantAddress, ApplicantPhone, ApplicantPostalCode, ApplicantBirth, ApplicantApplicationExpired, FormCode) VALUES (@ApplicantName, @ApplicantLastName, @ApplicantAlias, @ApplicantEmail, @ApplicantKey, @ApplicantAddress, @ApplicantPhone, @ApplicantPostalCode, @ApplicantBirth, @ApplicantApplicationExpired, @FormCode) ");
    console.log(result)
    if(req.body){
        return res.status(200).json({
            msg: "Aplicante creado con éxito"
        })
    }else{
        res.status(400).json({
            error: "Faltan datos requeridos"
        })
    }


    if (result.recordset[0].count > 0) {
        // Si el correo electrónico ya está registrado, rechaza la solicitud
        return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
      }
    if(!result){
        return res.status(400).json({
            msg: "Ha ocurrido un fallo al recibir los datos"
        })
    }
    if(result.rowsAffected[0] === 0){
        return res.status(400).json({
            msg: "No se pudo agregar el aplicante...!"
        })
    }
    res.status(200).json(result.recordset)
}

export const putApplicant = async (req = request, res) => {
    const { id } = req.params;
   

    if(isNaN(id)){
        return res.status(400).json({
            error: "El ID tiene que ser un numero."
        })
    }

    const pool = await dbConnection();

    let result = await pool
                            .request()
                            .query(`SELECT * FROM Applicant WHERE ApplicantID = ${req.params.id}`);
    if(result.recordset.length === 0){
        return res.status(404).json({
            error: `El aplicante con el ID: ${id} no existe en la base de datos.`
        })
    }else {
        
          result = await pool
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
         .input("FormCode", req.body.ApplicantApplicationExpired)
         .query(`UPDATE Applicant SET ApplicantName = @ApplicantName, ApplicantLastName = @ApplicantLastName, ApplicantAlias = @ApplicantAlias, ApplicantEmail =  @ApplicantEmail, ApplicantKey = @ApplicantKey, ApplicantAddress = @ApplicantAddress, ApplicantPhone =  @ApplicantPhone, ApplicantPostalCode = @ApplicantPostalCode, ApplicantBirth = @ApplicantBirth, ApplicantApplicationExpired =  @ApplicantApplicationExpired, FormCode = @FormCode WHERE ApplicantID = ${id}`);
         
         res.status(200).json({
            msg: "Aplicante actualizado con éxito",
            data: result.recordset
         })
    }
   

       
}