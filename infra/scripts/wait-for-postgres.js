const { exec } = require("node:child_process");

function checkPostgresReady() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgresReady();
      return;
    }
    console.log("\n \n🟢 PostgreSQL is ready and accepting connections!\n");
  }
}

process.stdout.write("\n\n🔴 Waiting for PostgreSQL to be ready");
checkPostgresReady();
