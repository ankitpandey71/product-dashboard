const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price REAL, stock_quantity INTEGER)"
  );
});

app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.post("/products", (req, res) => {
  const { name, description, price, stock_quantity } = req.body;
  db.run(
    `INSERT INTO products (name, description, price, stock_quantity) VALUES (?, ?, ?, ?)`,
    [name, description, price, stock_quantity],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      const newProduct = {
        id: this.lastID,
        name,
        description,
        price,
        stock_quantity,
      };
      io.emit("productAdded", newProduct);
      res.json(newProduct);
    }
  );
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock_quantity } = req.body;
  db.run(
    `UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ? WHERE id = ?`,
    [name, description, price, stock_quantity, id],
    function (err) {
      if (err) {
        return console.log(err.message);
      }
      const updatedProduct = {
        id: parseInt(id),
        name,
        description,
        price,
        stock_quantity,
      };
      io.emit("productUpdated", updatedProduct);
      res.json(updatedProduct);
    }
  );
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM products WHERE id = ?`, id, function (err) {
    if (err) {
      return console.log(err.message);
    }
    io.emit("productDeleted", { id: parseInt(id) });
    res.json({ id: parseInt(id) });
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
