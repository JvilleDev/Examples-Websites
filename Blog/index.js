const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const port = 3000;
const ejs = require("ejs");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use("/static", express.static("static"));
app.use("/posts", express.static("posts"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "base", "index.html"));
});
app.get("/search", (req, res) => {
  res.redirect("/");
});

app.get("/search/:searchTerm", (req, res) => {
  const searchTerm = req.params.searchTerm.toLowerCase();
  fs.readFile("posts.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error interno del servidor");
    }

    try {
      const posts = JSON.parse(data);
      const results = posts.filter((post) => {
        return (
          post.name.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm)
        );
      });

      // Pasa el término de búsqueda como variable a la vista
      res.render("search", { results, searchTerm });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error interno del servidor");
    }
  });
});
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "static/images/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.use(bodyParser.json({ limit: "30mb" }));
app.post("/new-post", upload.single("image"), (req, res) => {
  const markdownContent = req.body.markdownContent;
  const postDescription = req.body.description;
  const postCategories = req.body.categories;
  const imageFile = req.file; // Obtener información de la imagen subida

  if (!imageFile) {
    return res.status(400).send("No se ha proporcionado una imagen");
  }

  // Función para extraer el título del contenido Markdown
  function extractTitle(markdownContent) {
    const lines = markdownContent.split("\n");
    for (let line of lines) {
      if (line.trim().startsWith("# ")) {
        return line.trim().substring(2); // Eliminar el símbolo '#' y los espacios
      }
    }
    return "Título no encontrado"; // Título predeterminado si no se encuentra uno
  }

  const postTitle = extractTitle(markdownContent);
  const postsDirectory = "posts";
  fs.readdir(postsDirectory, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al leer la carpeta de posts");
    }

    const nextPostNumber = files.length + 1;
    const newPostFileName = `post${nextPostNumber}.md`;
    const newPostPath = `${postsDirectory}/${newPostFileName}`;
    fs.writeFile(newPostPath, markdownContent, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al crear el nuevo post en Markdown");
      }

      const indexedPostsPath = "posts.json";
      fs.readFile(indexedPostsPath, "utf8", (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error al leer el archivo "posts.json"');
        }
        let indexedPosts = JSON.parse(data);

        // Obtener la ruta relativa de la imagen
        const imagePath = path.join("static", "images", imageFile.filename);

        indexedPosts.push({
          name: postTitle,
          description: postDescription,
          categories: postCategories,
          content: markdownContent,
          id: nextPostNumber,
          image: "\\" + imagePath, // Agregar la ruta de la imagen al JSON
        });

        fs.writeFile(
          indexedPostsPath,
          JSON.stringify(indexedPosts, null, 2),
          (err) => {
            if (err) {
              console.error(err);
              return res
                .status(500)
                .send('Error al actualizar el archivo "posts.json"');
            }
            res
              .status(201)
              .send(
                "Nuevo post en Markdown creado y contenido indexado con éxito"
              );
          }
        );
      });
    });
  });
});
app.get("/new", (req, res) => {
  res.sendFile(path.join(__dirname, "base", "new.html"));
});
app.get("/categories", (req, res) => {
  res.sendFile(path.join(__dirname, "base", "categories.html"));
});
app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "base", "menu.html"));
});

app.get("/post", (req, res) => {
  res.sendFile(path.join(__dirname, "base", "post.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "base", "about.html"));
});
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "base", "contact.html"));
});

app.get("/posts.json", (req, res) => {
  res.sendFile(path.join(__dirname, "posts.json"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
