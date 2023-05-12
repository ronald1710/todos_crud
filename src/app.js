const express = require("express");
const db = require("./utils/database");
const Todos = require("./models/todos.model");
const cors = require('cors')
require ('dotenv').config();
const PORT=process.env.PORT || 8000;

db.authenticate()
  .then(() => console.log("base de datos conectada"))
  .catch((err) => console.log(err));

db.sync()
  .then(() => console.log("base de datos sincronizada"))
  .catch((err) => console.log(err));

const app = express();

app.use(cors())

app.use(express.json());

app.get("/", (req, res) => {
  res.send("servidor arriba");
});


 app.get('/v1/todos', async (req, res)=>{
     try{
         const todos = await Todos.findAll();
         res.json(todos);
     }
     catch (error){
         res.status(400).json(error)
     }
 })

 app.get("/v1/todos/id/:id", async (req, res) => {
     try {
       const { id } = req.params;
       const todo = await Todos.findByPk(id, {
       });
       res.json(todo);
     } catch (error) {
       res.status(400).json(error);
     }
   });

 app.post("/v1/todos", async (req, res) => {
   try {
     const newTodo = req.body;
     await Todos.create(newTodo);
     res.status(201).send();
   } catch (error) {
     res.status(400).json(error);
   }
 });

 app.put("/v1/todos/:id", async (req, res) => {
     try {
       const { id } = req.params;
       const { title, description, completed } = req.body;
       await Todos.update(
         { title, description, completed },
         {
           where: { id },
         }
       );
       res.status(204).send();
     } catch (error) {
       res.status(400).json(error);
     }
   });


 app.delete("/v1/todos/:id", async (req, res) => {
   try {
     const { id } = req.params;
     await Todos.destroy({
       where: { id },
     });
     res.status(204).send();
   } catch (error) {
     res.status(400).json(error);
   }
 });


app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}` );
});

