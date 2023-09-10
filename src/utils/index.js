const MapDBResult = ({
  id,
  title,
  performer
}) => ({
  id,
  title,
  performer
})

const songsQueryGenerator = (title, performer) => {
  if (title && performer) {
    return `SELECT * FROM songs WHERE title ILIKE '${title}%' AND performer ILIKE '${performer}%'`
  } else if (title) {
    return `SELECT * FROM songs WHERE title ILIKE '${title}%'`
  } else if (performer) {
    return `SELECT * FROM songs WHERE performer ILIKE '${performer}%'`
  } else {
    return 'SELECT * FROM songs'
  }
}

module.exports = { MapDBResult, songsQueryGenerator }
