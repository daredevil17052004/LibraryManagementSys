const { spawn } = require("child_process");

// Function to run a command and handle errors
const runCommand = (command, dir) => {
    const process = spawn(command, { shell: true, cwd: dir });

    process.stdout.on("data", (data) => console.log(data.toString()));
    process.stderr.on("data", (data) => console.error(`⚠️ Error: ${data.toString()}`));

    process.on("error", (err) => console.error(`❌ Failed to start ${command}: ${err.message}`));
    process.on("close", (code) => console.log(`✅ ${command} exited with code ${code}`));
};

// Start services
console.log("🚀 Starting all services...");

runCommand("npm install && node server.js", "backend");
runCommand("npm install && npm run dev", "frontend");
runCommand("docker compose up -d", ".");

console.log("✅ All services are running!");
