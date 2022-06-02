const knex = require('knex')

class ClienteMariaDB {
    constructor(options, tableName) {
        this.knex = knex(options)
        this.tableName = tableName
    }

    async save(producto) {
        try {
            return this.knex.insert(producto).into(this.tableName)
        } catch (err) {
            console.error(err)
        }
    }

    async getAll() {
        try {
            return await knex.from(this.tableName).select("*");
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = {ClienteMariaDB}