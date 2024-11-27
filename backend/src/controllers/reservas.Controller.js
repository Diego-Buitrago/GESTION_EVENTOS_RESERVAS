const { pool } = require('../database/database');

const getReservations = async (req, res) => {
    const { idEvento, estado, rows, first, sortField, sortOrder } = req.query;

    const connection = await pool.getConnection();

    try {  
      const order = sortOrder === 1 ? "ASC" : "DESC";
  
      const whereConditions = [];
      if (idEvento) whereConditions.push(`evento_id = ${idEvento}`);
      if (estado) whereConditions.push(`estado = '${estado}'`);
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  
      const [resultsQuery] = await connection.execute(`SELECT id, nombre_usuario nombre, email, numero_plazas numero, estado FROM reservas ${whereClause} GROUP BY id ORDER BY ${sortField} ${order} LIMIT ${rows} OFFSET ${first}`);
  
      let total = 0;
      if (first === 0) {
        const [resultsTotal] = await connection.execute(`SELECT COUNT(DISTINCT id) total FROM eventos ${whereClause}`);
        total = resultsTotal.total;
      }
  
      res.status(200).json({ results: resultsQuery, total });
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error al obtener la lista de reservas: " + error.message });
    }
};
  
const saveBooking = async (req, res) => {
    const { idEvento, nombre, email, numero } = req.body;

    const connection = await pool.getConnection();

    try {  
      const [[resultsQuery]] = await connection.execute(`SELECT e.cupo cupo, IFNULL(SUM(r.numero_plazas), 0) plazas FROM eventos e LEFT JOIN reservas r ON (r.evento_id = e.id AND r.estado != "cancelada") WHERE e.id = ?`, [idEvento]);
  
      const { cupo, plazas } = resultsQuery;
      const disponibles = cupo - plazas;

      if (disponibles <= 0) return res.status(400).json({ mensaje: "No hay plazas disponibles para el evento" });
      if (disponibles < Number(numero)) return res.status(400).json({ mensaje: `La cantidad de plazas ingresadas no están disponibles. Disponibles ${disponibles}` });
  
      const [insertQuery] = await connection.execute(`INSERT INTO reservas (evento_id, nombre_usuario, email, numero_plazas) VALUES(?,?,?,?)`, [idEvento, nombre, email, numero]);
      
      if (!insertQuery.insertId > 0) return res.status(400).json({ mensaje: "Ocurrió un error al crear la reserva en base de datos" });

      res.status(200).json({ mensaje: `Reserva ${nombre} creada correctamente`, id: insertQuery.insertId });
   
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error en el servidor: " + error.message });
    } finally {
      if (connection) connection.release();
    }
};

const updateBooking = async (req, res) => {
    const { id, estado } = req.body;

    const connection = await pool.getConnection();

    try {    
      const [updateQuery] = await connection.execute(`UPDATE reservas SET estado = ? WHERE id = ?`, [estado, id]);

      if (!updateQuery.affectedRows > 0) return res.status(500).json({ mensaje: "Ocurrió un error al actualizar la reserva base de datos" });    

      return res.status(200).json({ mensaje: `Estado Modificado Correctamente` });
        
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error en el servidor: " + error.message });
    } finally {
      if (connection) connection.release();
    }
};

module.exports = {
  getReservations,
  saveBooking,
  updateBooking,
}