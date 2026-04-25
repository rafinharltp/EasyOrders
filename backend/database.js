const DatabaseSQLite = require("better-sqlite3");

class Database {
    constructor() {

        this.db = new DatabaseSQLite("database.db");

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                preco REAL NOT NULL
            )
        `).run();
    }

    create(produto) {
        const stmt = this.db.prepare(`
            INSERT INTO produtos (nome, preco)
            VALUES (?, ?)
        `);

        const info = stmt.run(produto.nome, produto.preco);

        const novoProduto = {
            id: info.lastInsertRowid,
            ...produto
        };

        console.log('Produto criado:', novoProduto);
        return novoProduto;
    }

    readAll() {
        return this.db.prepare(`
            SELECT * FROM produtos
        `).all();
    }

    readById(id) {
        return this.db.prepare(`
            SELECT * FROM produtos WHERE id = ?
        `).get(id);
    }

    update(id, produtoAtualizado) {

        const stmt = this.db.prepare(`
            UPDATE produtos
            SET nome = ?, preco = ?
            WHERE id = ?
        `);

        const info = stmt.run(
            produtoAtualizado.nome,
            produtoAtualizado.preco,
            id
        );

        if (info.changes === 0) return null;

        const produto = this.readById(id);

        console.log('Produto atualizado:', produto);

        return produto;
    }

    delete(id) {

        const produto = this.readById(id);

        if (!produto) return null;

        this.db.prepare(`
            DELETE FROM produtos WHERE id = ?
        `).run(id);

        console.log('Produto excluído:', produto);

        return produto;
    }
}

module.exports = new Database();