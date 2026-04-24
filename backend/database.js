class Database {
    constructor() {
        this.produtos = [];
        this.nextId = 1;
    }

    create(produto) {
        produto.id = this.nextId++;
        this.produtos.push(produto);
        console.log('Produto criado:', produto);
        return produto;
    }

    readAll() {
        return this.produtos;
    }

    readById(id) {
        return this.produtos.find(p => p.id === parseInt(id));
    }

    update(id, produtoAtualizado) {
        const index = this.produtos.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            this.produtos[index] = { ...this.produtos[index], ...produtoAtualizado };
            console.log('Produto atualizado:', this.produtos[index]);
            return this.produtos[index];
        }
        return null;
    }

    delete(id) {
        const index = this.produtos.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            const produtoExcluido = this.produtos.splice(index, 1)[0];
            console.log('Produto excluído:', produtoExcluido);
            return produtoExcluido;
        }
        return null;
    }
}

module.exports = new Database();