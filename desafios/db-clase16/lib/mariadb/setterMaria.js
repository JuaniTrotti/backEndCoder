const { options } = require('./mariaDB')
const knex = require('knex')(options)

async function createTablesMariaDB() {
    try {
        await knex.schema.dropTableIfExists('productos')
        await knex.schema.createTable('productos', (table) => {
            table.increments('id').primary()
            table.string('title', 100).notNullable()
            table.decimal('price').notNullable()
            table.string('thumbnail', 200).notNullable()
        })
    } catch (error) {
        console.error(error)
    } finally {
        knex.destroy()
    }
}

module.exports = { createTablesMariaDB }