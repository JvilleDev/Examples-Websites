const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 5000;
const htmlToPdf = require('html-pdf-node');

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json()); // Cambia el middleware para analizar como JSON
// Crear un servidor HTTP independiente

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.post('/download', async (req, res) => {
    const htmlContent = req.body.htmlContent;
    
    try {
        // Define los márgenes en milímetros
        const margin = {
            top: '10mm',    // Márgen superior
            right: '10mm',  // Márgen derecho
            bottom: '10mm', // Márgen inferior
            left: '10mm'    // Márgen izquierdo
        };

        const options = {
            format: 'Letter',
            margin: margin // Agrega los márgenes aquí
        };

        const file = { content: htmlContent };

        // Agrega una etiqueta <link> para tu hoja de estilos
        const styledHtmlContent = `
            <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="http://localhost:5000/style.css">
                </head>
                <body>
                    ${htmlContent}
                </body>
            </html>
        `;

        const pdfBuffer = await htmlToPdf.generatePdf({ content: styledHtmlContent }, options);

        res.setHeader('Content-Disposition', 'attachment; filename=documento.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error al generar PDF:', error);
        res.status(500).send('Error al convertir HTML a PDF');
    }
});


app.post('/new', (req, res) => {
    const markdownContent = req.body.markdownContent;

    // Busca el primer título h1 en el contenido Markdown
    const match = markdownContent.match(/^#\s+(.*)/);
    if (match && match[1]) {
        const title = match[1].trim(); // El título encontrado (sin espacios al principio y al final)
        const fileName = `${title}.md`; // Utiliza el título como nombre de archivo
        const filePath = path.join(__dirname, 'Notas', fileName);

        // Comprueba si el archivo ya existe
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (!err) {
                // Si el archivo existe, edítalo reemplazando su contenido
                fs.writeFile(filePath, markdownContent, (err) => {
                    if (err) {
                        console.error('Error al guardar el archivo:', err);
                        res.status(500).send('Error al guardar el archivo');
                    } else {
                        console.log(`Archivo ${title} editado correctamente`);
                        res.status(200).json({ message: 'Archivo editado exitosamente', fileName: fileName, title: title });
                    }
                });
            } else {
                // Si el archivo no existe, crea uno nuevo
                fs.writeFile(filePath, markdownContent, (err) => {
                    if (err) {
                        console.error('Error al guardar el archivo:', err);
                        res.status(500).send('Error al guardar el archivo');
                    } else {
                        console.log(`Archivo ${title} guardado correctamente`);
                        res.status(200).json({ message: 'Archivo guardado exitosamente', fileName: fileName, title: title });
                    }
                });
            }
        });
    } else {
        res.status(400).send('El contenido Markdown no contiene un título válido');
    }
});
app.get('/view/:nombre', (req, res) => {
    const nombre = req.params.nombre;
    const filePath = path.join(__dirname, 'Notas', `${nombre}.md`);

    // Lee el contenido del archivo y envíalo como respuesta
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).send('Error al leer el archivo');
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/view', (req, res) => {
    const notasDir = path.join(__dirname, 'Notas');

    // Lee la lista de archivos en la carpeta "Notas"
    fs.readdir(notasDir, (err, files) => {
        if (err) {
            console.error('Error al listar los archivos:', err);
            res.status(500).send('Error al listar los archivos');
        } else {
            // Filtra los archivos con extensión .md y envía la lista de nombres sin extensión como respuesta
            const markdownFiles = files
                .filter(file => path.extname(file) === '.md')
                .map(file => path.basename(file, '.md')); // Obtiene el nombre sin la extensión .md
            res.status(200).json(markdownFiles);
        }
    });
});

app.get('/stream/:nombreDeArchivoSinExtension', (req, res) => {
    const nombreDeArchivoSinExtension = req.params.nombreDeArchivoSinExtension;
    const filePath = path.join(__dirname, 'Notas', `${nombreDeArchivoSinExtension}.md`);
    console.log('Archivo: ' + nombreDeArchivoSinExtension + ' solicitado');
    
    // Comprueba si el archivo existe
    fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
            console.error('Error al acceder al archivo:', err);
            res.status(500).send('Error al acceder al archivo');
        } else {
            // Lee el contenido del archivo
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error al leer el archivo:', err);
                    res.status(500).send('Error al leer el archivo');
                } else {
                    // Envia el contenido del archivo como JSON en la respuesta
                    const jsonData = { contenido: data };
                    res.json(jsonData);
                }
            });
        }
    });
});

app.get('/ver', (req,res)=>{
    res.sendFile(path.join(__dirname,'static','ver.html'))
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
