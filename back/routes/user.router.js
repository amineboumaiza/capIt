const express = require("express");

const route = express.Router();

const auth = require("../middleware/auth");

const userController = require("../controllers/user.controller");
route.post("/inscription", userController.inscription);
route.post("/login", userController.login);
route.get("/getUser", auth, userController.getUser);
route.get("/getCompany", auth, userController.getCompany);
route.post("/applyUserSettings", auth, userController.applyUserSettings);
route.post("/applyCompanySettings", auth, userController.applyCompanySettings);
route.get("/getCompanyName", auth, userController.getCompanyName);
route.post("/applyNewPic", auth, userController.applyNewPic);
route.post("/getCompanies", userController.getCompanies);
route.get("/getAdmin", auth, userController.getAdmin);
route.post("/getCompaniesAdmin", auth, userController.getCompaniesAdmin);
route.post("/delUserAdmin", auth, userController.delUserAdmin);
route.get("/search", userController.searchBar);
route.post("/delUser", auth, userController.delUser);
route.get("/getCompanyProfile/:username", userController.getCompanyProfile);
route.get("/getUsername", auth, userController.getUsername);
route.get("/getEmailCompany", auth, userController.getEmailCompany);
route.get("/getTokenValidation", auth, userController.getTokenValidation);
route.get("/getUserId", auth, userController.getUserId);
route.get("/getAllCompanies", auth, userController.getAllCompanies);
route.get(
  "/getCompanyNameByUserId/:userId",
  auth,
  userController.getCompanyNameByUserId
);
route.get("/getDaysRemaining", auth, userController.getDaysRemaining); // zyyd hedhy
"/getCompanyNameByUserId/:userId",
  route.get(
    "/emailconfirmation/:verificationToken",
    userController.emailconfirmation
  );
module.exports = route;
