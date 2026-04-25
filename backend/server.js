const http = require('http');
const url = require('url');
const Database = require('./database.js'); // ← ADICIONADO .js

const server = http.createServer((req, res) => {
    // ✅ CORS COMPLETO
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // ✅ OPTIONS preflight
    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    res.setHeader('Content-Type', 'application/json');

    console.log(`${req.method} ${path}`); // ← DEBUG

    // CREATE
    if (req.method === 'POST' && path === '/produtos') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const produto = JSON.parse(body);
                const novoProduto = Database.create(produto);
                res.statusCode = 201;
                res.end(JSON.stringify(novoProduto));
                console.log('✅ CRIADO:', novoProduto);
            } catch(e) {
                res.statusCode = 400;
                res.end(JSON.stringify({erro: 'JSON inválido'}));
            }
        });
        return;
    }

    // READ ALL
    if (req.method === 'GET' && path === '/produtos') {
        res.end(JSON.stringify(Database.readAll()));
        return;
    }

    // READ ONE
    if (req.method === 'GET' && path.match(/^\/produtos\/(\d+)$/)) {
        const id = path.split('/')[2];
        const produto = Database.readById(id);
        if (produto) {
            res.end(JSON.stringify(produto));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ erro: 'Produto não encontrado' }));
        }
        return;
    }

    // UPDATE
    if (req.method === 'PUT' && path.match(/^\/produtos\/(\d+)$/)) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const id = path.split('/')[2];
                const produtoAtualizado = JSON.parse(body);
                const resultado = Database.update(id, produtoAtualizado);
                if (resultado) {
                    res.end(JSON.stringify(resultado));
                } else {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ erro: 'Produto não encontrado' }));
                }
            } catch(e) {
                res.statusCode = 400;
                res.end(JSON.stringify({erro: 'JSON inválido'}));
            }
        });
        return;
    }

    // DELETE
    if (req.method === 'DELETE' && path.match(/^\/produtos\/(\d+)$/)) {
        const id = path.split('/')[2];
        const resultado = Database.delete(id);
        if (resultado) {
            res.end(JSON.stringify({ mensagem: 'Excluído!' }));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ erro: 'Não encontrado' }));
        }
        return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ erro: 'Rota inválida' }));
});

server.listen(3000, () => {
    console.log('🎉 http://localhost:3000 RODANDO!');
    console.log('📱 Teste: http://localhost:3000/produtos');
});