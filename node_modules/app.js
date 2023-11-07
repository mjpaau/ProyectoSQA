const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const sql = require('mssql'); 
const db = require('./config/database');

db.getConnection().catch(err => {
    console.error("Error al conectar a la base de datos:", err);
    process.exit(1); 
});

http.createServer((req, res) => {
    console.log(`${req.method} solicita ${req.url}`);

    const htmlPages = [
        '/about',
        '/blog',
        '/categorias',
        '/contact',
        '/furniture',
        '/',
        '/login',
        '/principaluser',
        '/register'
    ];

    if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const postData = querystring.parse(body);

            if (req.url === '/register') {
                // Código para el registro
                const query = `
                    INSERT INTO Usuario (Nombre, Email, Telefono, Dpi, Direccion, Contraseña) 
                    VALUES (@Nombre, @Email, @Telefono, @Dpi, @Direccion, @Contraseña);
                `;

                try {
                    const pool = await db.getConnection();
                    const request = pool.request();
                    request.input('Nombre', sql.NVarChar, postData.name);
                    request.input('Email', sql.NVarChar, postData.email);
                    request.input('Telefono', sql.NVarChar, postData.email);
                    request.input('Dpi', sql.NVarChar, postData.email);
                    request.input('Direccion', sql.NVarChar, postData.email);
                    request.input('Contraseña', sql.NVarChar, postData.password);

                    await request.query(query);

                    res.writeHead(302, { 
                        'Location': '/login.html' 
                    });
                    res.end();
                
                } catch (error) {
                    console.error("Error al insertar en la base de datos:", error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error interno del servidor');
                }

            } 
            
            else if (req.url === '/login') {
                try {
                    const pool = await db.getConnection();
                    const request = pool.request();
                    request.input('Email', sql.NVarChar, postData.email);
                    request.input('Contraseña', sql.NVarChar, postData.password);

                    const result = await request.query(`
                        SELECT * 
                        FROM Usuario 
                        WHERE Email = @Email AND Contraseña = @Contraseña
                    `);

                    if (result.recordset.length > 0) {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Autenticación exitosa!');
                    } else {
                        res.writeHead(401, { 'Content-Type': 'text/plain' });
                        res.end('Correo o contraseña incorrectos');
                    }
                } catch (error) {
                    console.error("Error al consultar en la base de datos:", error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error interno del servidor');
                }
            }

        });

    } else if (htmlPages.includes(req.url) || req.url.endsWith('.html')) {
        let filePath = './public_html';
        if (req.url === '/') {
            filePath += '/index.html';
        } else {
            filePath += req.url;
            if (!req.url.endsWith('.html')) {
                filePath += '.html';
            }
        }

        fs.readFile(filePath, 'utf-8', (err, html) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        });
    } else if (req.url.match(/.css$/)) {
        const reqPath = path.join(__dirname, 'public_html', req.url);
        const fileStream = fs.createReadStream(reqPath, 'utf-8');

        res.writeHead(200, { 'Content-Type': 'text/css' });
        fileStream.pipe(res);
    } else if (req.url.match(/.jpg$/)) {
        const reqPath = path.join(__dirname, 'public_html', req.url);
        const fileStream = fs.createReadStream(reqPath);

        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        fileStream.pipe(res);
    } else if (req.url.match(/.png$/)) {
        const reqPath = path.join(__dirname, 'public_html', req.url);
        const fileStream = fs.createReadStream(reqPath);

        res.writeHead(200, { 'Content-Type': 'image/png' });
        fileStream.pipe(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 ERROR');
    }

}).listen(8282);

console.log('Servidor iniciado...');
