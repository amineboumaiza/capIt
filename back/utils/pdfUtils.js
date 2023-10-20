const pdfTemplate = ({
  num,
  nom,
  vendeur,
  date,
  desc,
  price,
  tax,
  timbrePrice,
  total,
}) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `
        <!doctype html>
        <html>
           <head>
              <meta charset="utf-8">
              <title>Devis</title>
              <style>
        * {
          margin: 0;
          padding: 0;
        }
        body {
          padding: 20px;
        }
  
        hr {
          border-color: black;
        }
  
        main {
          margin-top: 80px;
        }
  
        .logo {
          width: 40px;
        }
        .buyer {
          margin: 0 50px;
          margin-left : 600px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-start;
        }
        .text {
          display: flex;
          margin: 3px;
        }
        .text > h5 {
          font-weight: 800;
          font-size: 15px;
        }
        .text > p {
          font-weight: 500;
          font-size: 13px;
        }
  
        .devis-info > h3 {
           font-weight : 600;
          font-size: 30px;
          margin: 30px 0;
        }
  
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          text-align: center;
        }
        th {
          border-bottom: 1px solid black;
        }
        th,
        tr,
        td {
          padding: 5px;
        }
  
        .totalprice {
          position: absolute;
          right: 20px;
          border-top: 1px solid black;
          width: 350px;
          display: flex;
          justify-content: space-between;
        }
        .totalprice > span {
          font-weight: 700;
          font-size: 18px;
        }
        .total{
           margin-right : 220px;
        }
  
        footer {
          margin-top: 100px;
          display: flex;
        }
      </style>
           </head>
           <body>
      <header>
        <img src="https://i.ibb.co/JyMLc5X/capitlogo.jpg" alt="" class="logo" />
        <hr />
        <p style="margin-top: 5px;">
          CapIt
        </p>
      </header>
      <main>
        <div class="buyer">
          <div class="text">
            <h5>Nom :&nbsp</h5>
            <p>${nom}</p>
          </div>
        </div>
        <div class="devis-info">
          <h3>Devis # S${num}</h3>
          <div class="text">
            <h5>Date du devis :&nbsp</h5>
            <p>${day}/${month}/${year}</p>
          </div>
          <div class="text">
            <h5>Vendeur :&nbsp</h5>
            <p>${vendeur}</p>
          </div>
        </div>
        <table class="pricing">
          <tr>
            <th>Description</th>
            <th>Prix unitaire</th>
            <th>Taxes</th>
            <th>Timbre</th>
          </tr>
          <tr>
            <td>${desc}</td>
            <td>${price}</td>
            <td>${tax}</td>
            <td>${timbrePrice}</td>
          </tr>
        </table>
        <div class="totalprice">
          <span class="total">Total</span>
          <span>${total}DT</span>
        </div>
      </main>
    </body>
        </html>
        `;
};
module.exports = {
  pdfTemplate,
};
