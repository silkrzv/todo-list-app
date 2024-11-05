import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import session from 'express-session';
import flash from 'connect-flash'; 

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "razvan",
  port: 5433,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());

app.get("/", async (req, res) => {
  try {
    const todayResult = await db.query("SELECT * FROM items WHERE category = 'Today' ORDER BY id ASC");
    const weekResult = await db.query("SELECT * FROM items WHERE category = 'Week' ORDER BY id ASC");
    const monthResult = await db.query("SELECT * FROM items WHERE category = 'Month' ORDER BY id ASC");

    res.render("index.ejs", {
      todayItems: todayResult.rows,
      weekItems: weekResult.rows,
      monthItems: monthResult.rows,
      errorMessage: req.flash("error"),
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem.trim();
  const category = req.body.category || "Today"; 
  
  if (item === "") {
    req.flash("error", "Please enter a valid item name."); 
    return res.redirect("/"); 
  }

  try {
    await db.query("INSERT INTO items (title, category) VALUES ($1, $2)", [item, category]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
