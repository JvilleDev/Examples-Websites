const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 5000;
const htmlToPdf = require('html-pdf-node');

app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

app.post('/download', async (req, res) => {
    const htmlContent = req.body.htmlContent;
    
    try {
        const margin = {
            top: '10mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm'
        };

        const options = {
            format: 'Letter',
            margin: margin
        };
        const file = { content: htmlContent };
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
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});


app.post('/new', (req, res) => {
    const markdownContent = req.body.markdownContent;
    const match = markdownContent.match(/^#\s+(.*)/);
    if (match && match[1]) {
        const title = match[1].trim();
        const fileName = `${title}.md`;
        const filePath = path.join(__dirname, 'notes', fileName);
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (!err) {
                fs.writeFile(filePath, markdownContent, (err) => {
                    if (err) {
                        console.error('Error saving file:', err);
                        res.status(500).send('Error saving file');
                    } else {
                        console.log(`File ${title} edited correctly`);
                        res.status(200).json({ message: 'File edited correctly', fileName: fileName, title: title });
                    }
                });
            } else {
                fs.writeFile(filePath, markdownContent, (err) => {
                    if (err) {
                        console.error('Error saving file:', err);
                        res.status(500).send('Error saving file');
                    } else {
                        console.log(`File ${title} saved correctly`);
                        res.status(200).json({ message: 'File saved correctly', fileName: fileName, title: title });
                    }
                });
            }
        });
    } else {
        res.status(400).send("Markdown file hasn't a valid title");
    }
});
app.get('/view/:nombre', (req, res) => {
    const nombre = req.params.nombre;
    const filePath = path.join(__dirname, 'notes', `${nombre}.md`);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
        } else {
            res.status(200).send(data);
        }
    });
});

app.get('/view', (req, res) => {
    const notesDir = path.join(__dirname, 'notes');
    fs.readdir(notesDir, (err, files) => {
        if (err) {
            console.error('Error getting list of files:', err);
            res.status(500).send('Error getting list of files');
        } else {
            const markdownFiles = files
                .filter(file => path.extname(file) === '.md')
                .map(file => path.basename(file, '.md'));
            res.status(200).json(markdownFiles);
        }
    });
});
app.get('/stream/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'notes', `${filename}.md`);
    console.log('Archivo: ' + filename + ' solicitado');
        fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
            console.error('Error getting file:', err);
            res.status(500).send('Error getting file');
        } else {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    res.status(500).send('Error reading file');
                } else {
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
