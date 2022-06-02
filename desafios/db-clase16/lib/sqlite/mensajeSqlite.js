const knex = require('knex')

class ClienteSqlite {
    constructor(options) {
        this.knex = knex(options)
    }

    async save(mensaje) {
        try {
            return this.knex.insert(mensaje).into("chat")
        } catch (err) {
            console.error(err)
        }
    }

    async getAll() {
        try {
            // return await knex.from(this.tableName).select("*");
            return await this.knex('chat').select('*');
        } catch (err) {
            console.error(err)
        }
    }
}

module.exports = {ClienteSqlite}