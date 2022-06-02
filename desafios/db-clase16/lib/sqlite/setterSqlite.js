const { optionsLite } = require('./sqlite')
const knex = require('knex')(optionsLite)

async function createTablesSqlite() {
    try {
        await knex.schema.dropTableIfExists('chat')
        await knex.schema.createTable('chat', (table) => {
            table.increments('id').primary()
            table.string('mail', 100).notNullable()
            table.timestamp('fecha').defaultTo(knex.fn.now())
            table.string('mensaje', 100).notNullable()
        })
    } catch (error) {
        console.error(error)
    } finally {
        knex.destroy()
    }
}

module.exports = { createTablesSqlite }