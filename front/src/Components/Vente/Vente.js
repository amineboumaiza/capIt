//Vente.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    sellerName: "",
    customerName: "",
    projectTitle: "",
    projectDiscription: "",
    billingAddress: "",
    paymentCondition: "",
    prix: "",
    taxRate: "",
    stampPrice: "",
    totalAmount: "",
    offerId: "",
  });

  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [newWindow, setNewWindow] = useState(null);

  const [offers, setOffers] = useState([]); // State to store available offers

  const [lastInvoiceNumber, setLastInvoiceNumber] = useState(0); // State to track the last invoice number

  const token = localStorage.getItem("token");
  const headers = {
    headers: {
      token: token,
    },
  };
  const [invoice, setInvoice] = useState([]);

  useEffect(() => {
    if (newWindow) {
      navigate("/home");
    }
  }, [newWindow]);

  const invoicedetails = async () => {
    try {
      console.log(state.propId);
      const queryParams = { propId: state.propId };

      console.log("hedhyyyhiaa");
      const pro = { propId: state.propId };
      console.log(pro);

      const response = await axios.get(
        `http://localhost:3001/vente/displayinvoice/${state.propId}`,
        headers
      );

      console.log("hedhyyy");
      console.log(response);

      setInvoice(response.data.partialInvoiceData2);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
    }
  };

  useEffect(() => {
    invoicedetails();
  }, []);

  // Fetch the last used invoice number for the seller
  const fetchLastInvoiceNumber = async (sellerName) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/vente/getLastInvoiceNumber/${sellerName}`,
        headers
      );
      setLastInvoiceNumber(response.data.lastInvoiceNumber);
    } catch (error) {
      console.error("Error fetching last invoice number:", error);
    }
  };

  useEffect(() => {
    // Fetch the last invoice number when the sellerName changes
    if (invoiceData.sellerName) {
      fetchLastInvoiceNumber(invoiceData.sellerName);
    }
  }, [invoiceData.sellerName]);

  const [taxRate, setTaxRate] = useState("");
  const [stampPrice, setStampPrice] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInvoiceData({
      ...invoiceData,
      [name]: value,
    });
    // Update tax rate and stamp price when the input fields change
    if (name === "taxRate") {
      setTaxRate(value);
    } else if (name === "stampPrice") {
      setStampPrice(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      // Increment the last invoice number and use it for the current invoice
      const newInvoiceNumber = lastInvoiceNumber + 1;
      const updatedInvoiceData = {
        ...invoiceData,
        invoiceNumber: newInvoiceNumber,
        propId: state.propId,
      };

      const response = await axios.post(
        "http://localhost:3001/vente/createInvoice",
        updatedInvoiceData,
        { ...headers, responseType: "blob" }
      );
      // Handle success, show a success message or redirect to another page
      console.log(response.data);
      const pdf = response.data;
      const pdfUrl = window.URL.createObjectURL(pdf);
      const windowRef = window.open(pdfUrl, "_blank");
      setNewWindow(windowRef);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      // Handle error, show an error message
    }
  };

  const [updatingPrice, setUpdatingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState("");

  const handleUpdatePrice = () => {
    setUpdatingPrice(true);
  };

  const handlePriceChange = (event) => {
    setNewPrice(event.target.value);
  };

  const handlePriceUpdate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/propositions/updatePrice",
        { propositionId: state.propId, newPrice: newPrice },
        headers
      );

      console.log(response.data);
      invoicedetails();
      // Update the UI or perform other actions as needed

      setUpdatingPrice(false);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  let totalAmount = 0; // Use let instead of const

  if (taxRate && stampPrice) {
    totalAmount =
      parseFloat(invoice.prix2) +
      (parseFloat(invoice.prix2) * parseFloat(taxRate)) / 100 +
      parseFloat(stampPrice);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <h1>Créer une facture</h1>
          </div>

          <div
            style={{
              marginLeft: "10rem",
              marginBottom: "1rem",
              alignItems: "center",
            }}
          >
            <div style={{ marginRight: "20rem", marginBottom: "1rem" }}>
              <p style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Nom du Vendeur : </h3>
                <h4 style={{ margin: 0, marginLeft: "10px" }}>
                  {invoice.sellerName2}
                </h4>
              </p>
            </div>
            <p style={{ display: "flex", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>adresse de facturation : </h3>
              <h4 style={{ margin: 0, marginLeft: "10px" }}>
                {invoice.billingAddress2}{" "}
              </h4>
            </p>
          </div>

          <div
            style={{
              marginLeft: "10rem",
              marginBottom: "1rem",
              alignItems: "center",
            }}
          >
            <div style={{ marginRight: "20rem", marginBottom: "1rem" }}>
              <p style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Nom du client : </h3>
                <h4 style={{ margin: 0, marginLeft: "10px" }}>
                  {invoice.customerName2}{" "}
                </h4>
              </p>
            </div>
            <p style={{ display: "flex", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Titre du projet : </h3>
              <h4 style={{ margin: 0, marginLeft: "10px" }}>
                {invoice.projectTitle2}{" "}
              </h4>
            </p>
          </div>

          <div
            style={{
              marginLeft: "10rem",
              marginBottom: "1rem",
              alignItems: "center",
            }}
          >
            <div style={{ marginRight: "20rem", marginBottom: "1rem" }}>
              <p style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ margin: 0 }}>Description du projet : </h3>
                <h4 style={{ margin: 0, marginLeft: "10px" }}>
                  {invoice.projectDescription2}{" "}
                </h4>
              </p>
            </div>
            <p style={{ display: "flex", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>prix : </h3>
              <h4 style={{ margin: 0, marginLeft: "10px" }}>{invoice.prix2}</h4>
            </p>
          </div>

          {!updatingPrice ? (
            <button
              type="submit"
              style={{ transform: "translate(-10rem,0px)" }}
              onClick={handleUpdatePrice}
            >
              Mettre à jour le prix
            </button>
          ) : (
            // Show the price update fields when updating price
            <div>
              <input
                style={{
                  marginLeft: "10rem",
                  marginBottom: "1rem",
                  width: "30%",
                }}
                type="number"
                name="newPrice"
                value={newPrice}
                onChange={handlePriceChange}
                placeholder="New Price"
              />
              <button
                type="submit"
                style={{ transform: "translate(-10rem,0px)" }}
                onClick={handlePriceUpdate}
              >
                Enregistrer
              </button>
            </div>
          )}

          <h4>Conditions de paiement :</h4>
          <input
            style={{ marginLeft: "10rem", marginBottom: "1rem", width: "30%" }}
            type="text"
            name="paymentCondition"
            value={invoiceData.paymentCondition}
            onChange={handleInputChange}
            placeholder="Conditions de paiement"
          />

          <h4>Taux d'imposition :</h4>
          <input
            style={{ marginLeft: "10rem", marginBottom: "1rem", width: "30%" }}
            type="number"
            name="taxRate"
            value={invoiceData.taxRate}
            onChange={handleInputChange}
            placeholder="Taux d'imposition"
          />

          <h4>Timbre Prix :</h4>
          <input
            style={{ marginLeft: "10rem", marginBottom: "1rem", width: "30%" }}
            type="Float"
            name="stampPrice"
            value={invoiceData.stampPrice}
            onChange={handleInputChange}
            placeholder="Timbre Prix"
          />

          <h3>Montant total : {totalAmount}</h3>

          <button
            style={{ transform: "translate(-10rem,0px)", minWidth: "150px" }}
            type="submit"
            className="d-flex justify-content-center align-items-center"
          >
            {isLoading ? (
              <ClipLoader
                color={"#FFFFFF"}
                size={15}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            ) : (
              "Créer une facture"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default InvoiceForm;
