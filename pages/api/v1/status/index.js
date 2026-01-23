import database from "infra/database.js";
import { InternalServerError } from 'infra/errors';

async function status(req, res) {
  try {
    const dataBaseVersionResult = await database.query("SHOW server_version;");
    const dataBaseVersionValue = dataBaseVersionResult.rows[0].server_version;

    const dataBaseMaxConnectionsResult = await database.query(
      "SHOW max_connections;",
    );
    const dataBaseMaxConnectionsValue =
      dataBaseMaxConnectionsResult.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;
    const dataBaseOpenedConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity where datname = $1;",
      values: [databaseName],
    });

    const dataBaseOpenedConnectionsValue =
      dataBaseOpenedConnectionsResult.rows[0].count;

    res.status(200).json({
      update_at: new Date().toISOString(),
      dependencies: {
        database: {
          version: dataBaseVersionValue,
          max_connections: parseInt(dataBaseMaxConnectionsValue),
          opened_connections: parseInt(dataBaseOpenedConnectionsValue),
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({ cause: error });
    console.log("\n Error on catch controller: ");
    console.error(publicErrorObject);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default status;
