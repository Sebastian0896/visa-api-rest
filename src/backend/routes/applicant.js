import { Router } from "express";

import { getApplicant, getApplicants, postApplicant } from "../controllers/applicant.controllers.js";

const applicantRouter = Router();

applicantRouter.get("/api/applicants", getApplicants);
applicantRouter.get("/api/applicants/:id", getApplicant);
applicantRouter.post("/api/applicant", postApplicant);




export default applicantRouter;