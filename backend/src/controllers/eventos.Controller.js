const { pool } = require('../database/database');

const getEvents = async (req, res) => {
    const { rows, first, sortField, sortOrder } = req.query;

    const connection = await pool.getConnection();

    try {  
      const order = sortOrder === 1 ? "ASC" : "DESC";
  
      const [resultsQuery] = await connection.execute(`SELECT id, nombre, descripcion, fecha, cupo FROM eventos GROUP BY id ORDER BY ${sortField} ${order} LIMIT ${rows} OFFSET ${first}`);
  
      let total = 0;
      if (first === 0) {
        const [resultsTotal] = await connection.execute(`SELECT COUNT(DISTINCT id) total FROM eventos`);
        total = resultsTotal.total;
      }
  
      res.status(200).json({ results: resultsQuery, total });
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error al obtener la lista de eventos: " + error.message });
    }
};
  
const saveEvent = async (req, res) => {
    const { nombre, descripcion, fecha, cupo } = req.body;

    const connection = await pool.getConnection();

    try {
  
      const [[resultsQuery]] = await connection.execute(`SELECT id FROM eventos WHERE nombre = ? LIMIT 1`, [nombre]);
  
      if (resultsQuery) return res.status(400).json({ mensaje: `Ya existe un evento con el nombre ${nombre}. Verificar` });
  
      const [insertQuery] = await connection.execute(`INSERT INTO eventos (nombre, descripcion, fecha, cupo) VALUES(?,?,?,?)`, [nombre, descripcion, fecha, cupo]);

      
      if (!insertQuery.insertId > 0) return res.status(400).json({ mensaje: "Ocurrió un error al crear el evento en base de datos" });

      res.status(200).json({ mensaje: `Evento ${nombre} creado correctamente`, id: insertQuery.insertId });
   
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error en el servidor: " + error.message });
    } finally {
      if (connection) connection.release();
    }
};

const updateEvent = async (req, res) => {
    const { id, nombre, descripcion, fecha, cupo } = req.body;

    const connection = await pool.getConnection();

    try {  
        const [[resultsQuery]] = await connection.execute(`SELECT id FROM eventos WHERE nombre = ? AND id != ? LIMIT 1`, [nombre, id]);
  
        if (resultsQuery) return res.status(400).json({ mensaje: `Ya existe un evento con el nombre ${nombre}. Verificar` });    

        const [updateQuery] = await connection.execute(`UPDATE eventos SET nombre = ?, descripcion = ?, fecha = ?, cupo = ? WHERE id = ?`, [nombre, descripcion, fecha, cupo, id]);

        if (!updateQuery.affectedRows > 0) return res.status(500).json({ mensaje: "Ocurrió un error al modificar el evento en base de datos" });    

        return res.status(200).json({ mensaje: `Evento ${nombre} Modificado Correctamente` });
        
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error en el servidor: " + error.message });
    } finally {
      if (connection) connection.release();
    }
};
  
const deleteEvent = async (req, res) => {
    const { id } = req.query;
  
    const connection = await pool.getConnection();
    try {
  
      const [deleteQuery] = await connection.execute("DELETE FROM eventos WHERE id = ?", [id]);
  
      if (!deleteQuery.affectedRows > 0) return res.status(500).json({ mensaje: "Erro al eliminar el evento de la base de datos" });
  
      return res.status(200).json({ mensaje: "Evento Eliminado Correctamente." });
    } catch (error) {
      console.log(error);
      if (connection) await connection.rollback();
      res.status(500).json({ mensaje: "Error en el servidor: " + error.message });
    } finally {
      if (connection) connection.release();
    }
};

module.exports = {
    getEvents,
    saveEvent,
    updateEvent,
    deleteEvent
}