const { pool } = require('../database/database');

const getEvents = async (req, res) => {
  const { rows, first, sortField, sortOrder } = req.query;

  // Obtener una conexión del pool
  const client = await pool.connect();

  try {  
    const order = sortOrder === 1 ? "ASC" : "DESC";

    const resultsQuery = await client.query(`SELECT id, nombre, descripcion, fecha, cupo FROM public.eventos GROUP BY id ORDER BY ${sortField} ${order} LIMIT ${rows} OFFSET ${first}`);

    let total = 0;
    if (first === 0) {
      const { rows: rows2 } = await connection.execute(`SELECT COUNT(DISTINCT id) total FROM eventos`);
      total = rows2[0].total;
    }
    // Liberar la conexión
    client.release();

    res.status(200).json({ results: resultsQuery.rows, total });
  } catch (error) {
    client.release();
    console.log(error);
    res.status(500).json({ mensaje: "Error al obtener la lista de eventos: " + error.message });
  }
};
  
const saveEvent = async (req, res) => {
    const { nombre, descripcion, fecha, cupo } = req.body;

    const client = await pool.connect();

    try {  
      const { rows } = await client.query(`SELECT id FROM eventos WHERE nombre = $1 LIMIT 1`, [nombre]);
  
      if (rows.length) return res.status(400).json({ mensaje: `Ya existe un evento con el nombre ${nombre}. Verificar` });
  
      const {rows: rows2 } = await client.query(`INSERT INTO eventos (nombre, descripcion, fecha, cupo) VALUES($1,$2,$3,$4) RETURNING id`, [nombre, descripcion, fecha, cupo]);
      
      if (!rows2[0].id > 0) return res.status(400).json({ mensaje: "Ocurrió un error al crear el evento en base de datos" });

      res.status(200).json({ mensaje: `Evento ${nombre} creado correctamente`, id: rows2[0].id });
   
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error en el servidor: " + error.message });
    } finally {
      if (client) client.release();
    }
};

const updateEvent = async (req, res) => {
  const { id, nombre, descripcion, fecha, cupo } = req.body;

  const client = await pool.connect();

  try {  
    const { rows } = await client.query(`SELECT id FROM eventos WHERE nombre = $1 AND id != $2 LIMIT 1`, [nombre, id]);

    if (rows.length) return res.status(400).json({ mensaje: `Ya existe un evento con el nombre ${nombre}. Verificar` });    

    const { rowCount } = await client.query(`UPDATE eventos SET nombre = $1, descripcion = $2, fecha = $3, cupo = $4 WHERE id = $5`, [nombre, descripcion, fecha, cupo, id]);
    
    if (!rowCount > 0) return res.status(500).json({ mensaje: "Ocurrió un error al modificar el evento en base de datos" });    

    return res.status(200).json({ mensaje: `Evento ${nombre} Modificado Correctamente` });      
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: "Error en el servidor: " + error.message });
  } finally {
    if (client) client.release();
  }
};
  
const deleteEvent = async (req, res) => {
    const { id } = req.query;  
    
    const client = await pool.connect();

    try {  
      const { rowCount } = await client.query("DELETE FROM eventos WHERE id = $1", [id]);
  
      if (!rowCount > 0) return res.status(500).json({ mensaje: "Erro al eliminar el evento de la base de datos" });
  
      return res.status(200).json({ mensaje: "Evento Eliminado Correctamente." });
    } catch (error) {
      console.log(error);
      if (connection) await connection.rollback();
      res.status(500).json({ mensaje: "Error en el servidor: " + error.message });
    } finally {
      if (client) client.release()
    }
};

module.exports = {
    getEvents,
    saveEvent,
    updateEvent,
    deleteEvent
}