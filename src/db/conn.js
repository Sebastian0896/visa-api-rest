
import sql from "mssql";

const sqlConfig = {
    user:"sebastian",
    password: "Config0896@",
    database: "VisaAppDB",
    server: 'localhost',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}
export const dbConnection = async () => {
    
        try {
          const pool = await sql.connect(sqlConfig);
          console.log("Conexión exitosa...!")
          return pool;
       /*    const result = await sql.query`select * from Applicant where ApplicantID=${2}`
          console.dir(result) */
          
        } catch (error) {
          throw new Error(`Ocurrió un error: ${error}`)
        }
      

}
