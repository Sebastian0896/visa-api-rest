import { Router } from "express";

import { getForm, getForms, postForm } from "../controllers/form.controllers.js";

const formRouter = Router();

formRouter.get("/api/forms", getForms);
formRouter.get("/api/forms/:id", getForm);
formRouter.post("/api/forms", postForm);




export default formRouter;