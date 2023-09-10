class SongsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator
  }

  async postSongHandler (request, h) {
    this._validator.validateSongsPayload(request.payload)
    const { title = 'untitled', year, genre, performer, duration, albumId = null } = request.payload
    const songId = await this._service.addSong({ title, year, genre, performer, duration, albumId })

    const response = h.response({
      status: 'success',
      data: {
        songId
      }
    })

    response.code(201)
    return response
  }

  async getSongsHandler (request) {
    const { title, performer } = request.query
    console.log(title, performer)
    const songs = await this._service.getSongs(title, performer)

    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  async getSongByIdHandler (request) {
    const { id } = request.params
    const song = await this._service.getSongById(id)

    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  async putSongByIdHandler (request) {
    const { id } = request.params
    this._validator.validateSongsPayload(request.payload)
    const { title = 'untitled', year, genre, performer, duration, albumId = null } = request.payload
    await this._service.editSongById(id, { title, year, genre, performer, duration, albumId })

    return {
      status: 'success',
      message: 'Lagu berhasil diubah'
    }
  }

  async deleteSongByIdHandler (request) {
    const { id } = request.params
    await this._service.deleteSongById(id)

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    }
  }
}

module.exports = SongsHandler
