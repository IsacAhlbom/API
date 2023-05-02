const express = require("express");
const mysql = require("mysql");
var bodyParser = require("body-parser");
const app = express();
const port = 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
// starta servern

// konfigurera databasanslutning
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "inlämning6",
});

// testa databasanslutning
connection.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL database:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

// hämta alla användare
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM loginbase";
  connection.query(sql, (err, result) => {
    if (err) {
      console.log("Error fetching users:", err);
      res.status(500).json({ error: "Error fetching users" });
    } else {
      res.json(result);
    }
  });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM loginbase WHERE id = '${id}'`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log("Error fetching id:", err);
      res.status(500).json({ error: "Error fetching users" });
    } else {
      res.json(result);
    }
  });
});

//POST /users

const crypto = require("crypto"); //använder NodeJS inbyggda krypteringsfunktioner.

function hash(data) {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/users", function (req, res) {
  if (req.body.username && req.body.password && req.body.name) {
    //Kollar om användaren har skickat in password, username och namn
    let sql = `SELECT * from loginbase WHERE username = "${req.body.username}"`;
    // Kollar om användarnamnet redan finns
    connection.query(sql, function (err, result) {
      if (err) throw err; // Kollar fel
      if (result.length === 0) {
        //Om svaret från databasen har längden 0 innebär det att ingen data finns med det användarnamnet dvs. vi kan skapa en sådan användare utan att det blir konflikter senare
        //No existing users found
        let passwordHash = hash(req.body.password); // Hashar lösenordet så att det inte sparas i klartext
        let sql = `INSERT INTO loginbase (name, password, username) VALUES ("${req.body.name}", "${passwordHash}", "${req.body.username}")`; // Skapar en användare med datan som skickas in

        connection.query(sql, function (err, result, fields) {
          // Skickar in sql-satsen för att skapa användaren i databasen
          const createdUser = result.insertId;
          if (err) throw err;
          res.status(201).json({
            updatedId: createdUser, //Skickar den skapade användarens Id tillbaka med kod 201 att det lyckades
          });
        });
      } else {
        // Else satsen svarar om användaren redan finns, se tidigare if-sats rad 17
        //Username already exists
        res.status(400).json({
          //Skickar felkod 400 + ett meddelande
          message: "Username already taken.",
        });
      }
    });
  }
});
app.get("/", (req, res) => {
  filVag = __dirname + "/servertext.html";
  console.log(filVag);
  res.sendFile(filVag);
});
//
