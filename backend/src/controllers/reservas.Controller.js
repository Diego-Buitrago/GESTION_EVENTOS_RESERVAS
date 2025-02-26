const { pool } = require('../database/database');

const getReservations = async (req, res) => {
    const { idEvento, estado, rows, first, sortField, sortOrder } = req.query;

    const client = await pool.connect();

    try {  
      const order = sortOrder === 1 ? "ASC" : "DESC";
  
      const whereConditions = [];
      if (idEvento) whereConditions.push(`evento_id = ${idEvento}`);
      if (estado) whereConditions.push(`estado = '${estado}'`);
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  
      const { rows: resultsQuery } = await client.query(`SELECT id, nombre_usuario nombre, email, numero_plazas numero, estado FROM reservas ${whereClause} GROUP BY id ORDER BY ${sortField} ${order} LIMIT ${rows} OFFSET ${first}`);
  
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
    finally {
      if (client) client.release();
    }
};
  
const saveBooking = async (req, res) => {
    const { idEvento, nombre, email, numero } = req.body;

    const client = await pool.connect();

    try {  
      const { rows: resultsQuery } = await client.query(`SELECT e.cupo cupo, COALESCE(SUM(r.numero_plazas), 0) plazas FROM eventos e LEFT JOIN reservas r ON (r.evento_id = e.id AND r.estado != 'cancelada') WHERE e.id = $1 GROUP BY e.id LIMIT 1`, [idEvento]);
  
      const { cupo, plazas } = resultsQuery[0];
      const disponibles = cupo - plazas;

      if (disponibles <= 0) return res.status(400).json({ mensaje: "No hay plazas disponibles para el evento" });
      if (disponibles < Number(numero)) return res.status(400).json({ mensaje: `La cantidad de plazas ingresadas no están disponibles. Disponibles ${disponibles}` });
  
      const { rows: insertQuery } = await client.query(`INSERT INTO reservas (evento_id, nombre_usuario, email, numero_plazas) VALUES($1,$2,$3,$4) RETURNING id`, [idEvento, nombre, email, numero]);
      
      if (!insertQuery[0]?.id > 0) return res.status(400).json({ mensaje: "Ocurrió un error al crear la reserva en base de datos" });

      res.status(200).json({ mensaje: `Reserva ${nombre} creada correctamente`, id: insertQuery[0]?.id || null});
   
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error en el servidor: " + error.message });
    } finally {
      if (client) client.release();
    }
};

const updateBooking = async (req, res) => {
    const { id, estado } = req.body;

    const client = await pool.connect();

    try {    
      const { rowCount } = await client.query(`UPDATE reservas SET estado = $1 WHERE id = $2`, [estado, id]);

      if (!rowCount > 0) return res.status(500).json({ mensaje: "Ocurrió un error al actualizar la reserva base de datos" });    

      return res.status(200).json({ mensaje: `Estado Modificado Correctamente` });
        
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error en el servidor: " + error.message });
    } finally {
      if (client) client.release();
    }
};

module.exports = {
  getReservations,
  saveBooking,
  updateBooking,
}