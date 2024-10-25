import { Router } from "express";

import { getApplicant, getApplicants, postApplicant, putApplicant } from "../controllers/applicant.controllers.js";

const applicantRouter = Router();

applicantRouter.get("/api/applicants", getApplicants);
applicantRouter.get("/api/applicants/:id", getApplicant);
applicantRouter.post("/api/applicant", postApplicant);
applicantRouter.put("/api/applicant/:id", putApplicant);




export default applicantRouter;