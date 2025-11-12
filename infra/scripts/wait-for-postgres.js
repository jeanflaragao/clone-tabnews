const { exec } = require('node:child_process');

function checkPostgresReady() {
  exec(
    "docker exec postgres-dev pg_isready --host localhost",
    handleReturn
  );

  function handleReturn(error, stdout, stderr) {
    if (stdout.search('accepting connections') === -1) {
      process.stdout.write(".");
      checkPostgresReady();
      return;
    } else {
      console.log("\nPostgreSQL is ready!\n");
      process.exit(0);
    }
  }
}

process.stdout.write("\n\nWaiting for PostgreSQL to be ready");
checkPostgresReady();