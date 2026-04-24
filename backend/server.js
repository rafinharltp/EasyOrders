const http = require('http');
const url = require('url');
const Database = require('./database');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST' && path === '/produtos') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const produto = JSON.parse(body);
            const novoProduto = Database.create(produto);
            res.statusCode = 201;
            res.end(JSON.stringify(novoProduto));
        });
    }
    else if (req.method === 'GET' && path === '/produtos') {
        const produtos = Database.readAll();
        res.end(JSON.stringify(produtos));
    }
    else if (req.method === 'GET' && path.match(/^\/produtos\/(\d+)$/)) {
        const id = path.split('/')[2];
        const produto = Database.readById(id);
        if (produto) {
            res.end(JSON.stringify(produto));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ erro: 'Produto não encontrado' }));
        }
    }
    else if (req.method === 'PUT' && path.match(/^\/produtos\/(\d+)$/)) {
        const id = path.split('/')[2];
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const produtoAtualizado = JSON.parse(body);
            const resultado = Database.update(id, produtoAtualizado);
            if (resultado) {
                res.end(JSON.stringify(resultado));
            } else {
                res.statusCode = 404;
                res.end(JSON.stringify({ erro: 'Produto não encontrado' }));
            }
        });
    }
    else if (req.method === 'DELETE' && path.match(/^\/produtos\/(\d+)$/)) {
        const id = path.split('/')[2];
        const resultado = Database.delete(id);
        if (resultado) {
            res.end(JSON.stringify({ mensagem: 'Produto excluído com sucesso' }));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ erro: 'Produto não encontrado' }));
        }
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
    }
});

server.listen(3000, () => {
    console.log('🎉 Servidor rodando em http://localhost:3000');
});