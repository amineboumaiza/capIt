import "./App.css";
import React, { useEffect } from "react";
import { SocketProvider } from "./socketProvider";
import Footer from "./Components/Footer/Footer";
import Register from "./Pages/Register/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Offres from "./Pages/Offres/Offres";
import Annuaire from "./Pages/Annuaire/Annuaire";
import Connexion from "./Pages/Connexion/Connexion";
import Navbar from "./Components/Navbar/Navbar";
import Navbaruser from "./Components/Navbar/Navbaruser";
import Layout from "./Components/layout/Layout";
import UserSettings from "./Components/pages/settings/UserSettings";
import Chat from "./Components/chat/Chat";
import { Context, AppContext } from "./Context";
import { useContext } from "react";
import CompanySettings from "./Components/pages/settings/CompanySettings";
import RechercheEntreprise from "./Components/pages/RechercheEntreprise/RechercheEntreprise";
import Profile from "./Pages/Profile/Profile";
import CompanyProfile from "./Pages/Profile/CompanyProfile";
import Formulaire from "./Components/Post Formulaire/Formulaire";
import BlogF from "./Components/Blog Formulaire/BlogF";
import Postuler from "./Components/FormulairePostuler/Postuler";
import Dashboard from "./Components/pages/dashboard/Dashboard";
import CRM from "./Components/CRM/CRM";
import MesOffres from "./Components/pages/Demandes/MesOffres";
import axios from "axios";
import Archive from "./Components/Archive/Archive";
import Facturation from "./Components/Vente/Vente";

function App() {
  const refresh = () => window.location.reload(true);
  let context = useContext(AppContext);
  function getTokenValidation() {
    const token = localStorage.getItem("token");
    const headers = {
      headers: {
        token: token,
      },
    };

    axios
      .get("http://localhost:3001/users/getTokenValidation", headers)
      .then((response) => {
        console.log("APPP TOKEN VALIDDATIONN");
        console.log(response);
        console.log(response.data.isValid);
        if (!response.data.isValid) {
          console.log("ISVALID FL APP", response);
          localStorage.removeItem("token");
          localStorage.removeItem("user_data");
          context.setConfig({ ...context.config, isConnected: false });
          refresh();
        }
      });
  }
  useEffect(() => {
    getTokenValidation();
  }, []);

  console.log(context);
  if (context.config.isConnected) {
    return (
      <>
        <div>
          <BrowserRouter>
            <SocketProvider>
              <Navbaruser />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route path="userSettings" element={<UserSettings />} />
                  <Route path="companySettings" element={<CompanySettings />} />
                  <Route path="NouveauOffre" element={<Formulaire />} />
                  <Route path="EditOffre/:id" element={<Formulaire />} />{" "}
                  <Route path="NouveauBlog" element={<BlogF />} />
                  <Route path="CRM" element={<CRM />} />
                  <Route path="MesOffres" element={<MesOffres />} />
                  <Route path="Dashboard" element={<Dashboard />} />
                  <Route path="Archive" element={<Archive />} />
                  <Route path="Vente" element={<Facturation />} />
                  <Route
                    path="RechercheEntreprise"
                    element={<RechercheEntreprise />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/Dashboard" replace={true} />}
                  />
                </Route>
                <Route path="/chat" element={<Chat />} />
                <Route path="/home" element={<Home />} />
                <Route path="/offres" element={<Offres />} />
                <Route path="/annuaire" element={<Annuaire />} />
                <Route path="/Profile/:username" element={<CompanyProfile />} />
                <Route path="/Reponse/:id" element={<Postuler />} />
              </Routes>
            </SocketProvider>
          </BrowserRouter>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="inscription*" element={<Register />} />
              <Route path="connexion*" element={<Connexion />} />
              <Route path="offres*" element={<Offres />} />
              <Route path="annuaire*" element={<Annuaire />} />
              <Route path="/Profile" element={<CompanyProfile />} />

              <Route
                path="*"
                element={<Navigate to="/home" replace={true} />}
              />
            </Routes>
          </BrowserRouter>
        </div>
      </>
    );
  }
}

export default App;
