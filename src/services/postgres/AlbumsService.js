const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariatError')
const NotFoundError = require('../../exceptions/NotFoundError')

class AlbumsService {
  constructor () {
    this._pool = new Pool()
  }

  async addAlbum ({ name, year }) {
    const id = nanoid(16)
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getAlbumById (id) {
    const query = {
      text: "SELECT albums.id, albums.name, albums.year, COALESCE(json_agg(json_build_object('id', songs.id, 'title', songs.title, 'performer', songs.performer))FILTER (WHERE songs.id IS NOT NULL), '[]') AS songs FROM albums FULL JOIN songs ON albums.id = songs.album_id WHERE albums.id = $1 GROUP BY albums.id",
      values: [id]
    }

    const result = await this._pool.query(query)
    console.log(id, result.rows)

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    return result.rows[0]
  }

  async editAlbumById (id, { name, year }) {
    const updatedAt = new Date().toISOString()

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan')
    }
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)
    console.log(result.rows)

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan')
    }
  }
}

module.exports = AlbumsService
