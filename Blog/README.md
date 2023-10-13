# Español:
## Blog de ejemplo

Página de Ejemplo con Bootstrap, JavaScript, HTML y Node.

---
**Descarga las dependencias con**
`npm i`

**Ejecuta el proyecto con**
`npm start` o `node index.js`

**Accede a `http://localhost:3100` para ver el Blog.**

### Características
- Página de inicio:
	- Función de búsqueda de jQuery
	-  Sección para publicaciones, descripción, categorías, e imagen destacada de cada una.

	![Home Page](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/home.png)
- Lista de categorías usadas
![Categories](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/categories.png)
- Ruta para subir nueva publicación en `/new`.
	- ***Nota: Debes usar MarkDown, y el primer "# Encabezado" que encuentre, lo usará como título para la publicación***
	- Subida de imagen para usar como destacada, la cual se almacenará en `/static/images/...`

	![](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/new-post.png)
- Página dedicada a **"Acerca de"**
![](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/about.png)
- Formulario de contacto, que al enviarlo, abrirá un modal con la información ingresada por el usuario a modo de confirmación
![](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/contact-form.png)
- Función de búsqueda a texto completo en la ruta `/search/:searchTerm`
	-	Si no se le proporciona término de búsqueda, redirigirá al usuario a la página principal

	![](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/search.png)

## Desventajas
- No tiene sistema de autenticación
- Formulario de contacto mejorable
---
### Nota: Para aportes o ideas, puedes contactarme a mi e-mail: jvilledev@gmail.com

---
# English:
## Blog Example

Example Page with Bootstrap, JavaScript, HTML, and Node.

---
**Download dependencies with**
`npm i`

**Run the project with**
`npm start` or `node index.js`

**Access `http://localhost:3100` to view the Blog.**

### Features
- Home Page:
	- jQuery search function
	- Section for posts, descriptions, categories, and a featured image for each.

	![Home Page](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/home.png)
- List of used categories
![Categories](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/categories.png)
- Route to upload a new post at `/new`.
	- ***Note: You must use Markdown, and the first "# Header" it finds will be used as the post title.***
	- Upload an image to use as a featured image, which will be stored in `/static/images/...`

	![](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/new-post.png)
- Page dedicated to **"About"**
![](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/about.png)
- Contact form, which, when submitted, will open a modal with the user's entered information as confirmation.
![](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/contact-form.png)
- Full-text search function at the `/search/:searchTerm` route.
	- If no search term is provided, it will redirect the user to the main page.

	![](https://raw.githubusercontent.com/JvilleDev/Examples-Websites/main/Blog/screenshoots/search.png)

## Disadvantages
- No authentication system
- Room for improvement in the contact form
---
### Note: For contributions or ideas, you can contact me at my email: jvilledev@gmail.com
