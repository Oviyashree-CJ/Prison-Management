const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3001;
const cors = require('cors');
const path = require('path');
const multer = require('multer');  // We use multer for form-data parsing

// Middleware setup
app.use(cors());
app.use(express.json()); // This is sufficient to handle JSON payloads.
app.use(express.urlencoded({ extended: true }));  // This allows parsing form-data (if needed)
app.use(express.static(path.join(__dirname))); // Serving static files

// Serve index.html on the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve CRUD operations page
app.get('/crud', (req, res) => {
    res.sendFile(path.join(__dirname, 'crud.html'));
});

// PostgreSQL Connection Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'prison',
    password: 'hellooviya',
    port: 5432,
});

// Login endpoint
app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === 'ajok') {
        res.status(200).send('Login successful');
    } else {
        res.status(403).send('Invalid password');
    }
});

// Helper function to validate table names
function isValidTableName(table) {
    const validTables = ['prisoners', 'guards', 'visits', 'users', 'healthrecords', 'crimeTypes', 'cells', 'prisonerCrimes'];
    return validTables.includes(table.toLowerCase());
}

// CRUD Operations

// Predefined queries
const queries = [
    "SELECT * FROM Prisoners",
    "SELECT * FROM Guards",
    "SELECT Name, DOB FROM Prisoners WHERE SentenceYears > 5",
    "SELECT * FROM Visits",
    "SELECT * FROM Users",
    "SELECT prisonercrimes.recordid, prisoners.name, crimetypes.crimename FROM prisonercrimes JOIN prisoners ON prisonercrimes.prisonerid = prisoners.prisonerid JOIN crimetypes ON prisonercrimes.crimeid = crimetypes.crimeid",
    "SELECT * FROM HealthRecords",
    "SELECT * FROM CrimeTypes",
    "SELECT * FROM Cells",
    "SELECT COUNT(*) AS TotalPrisoners FROM prisoners",
    "SELECT ct.crimename, COUNT(pc.prisonerid) AS prisoner_count FROM prisonercrimes pc JOIN crimetypes ct ON pc.crimeid = ct.crimeid GROUP BY ct.crimename ORDER BY prisoner_count DESC",
    "SELECT name, shiftstart, shiftend FROM guards WHERE shiftstart >= '12:00:00'",
    "SELECT prisonerid, MAX(sentenceyears) FROM prisoners GROUP BY prisonerid",
    "SELECT crimeid, COUNT(*) AS crimecount FROM prisonercrimes GROUP BY crimeid",
    "SELECT visitorname, visitdate FROM visits WHERE visitdate > '2024-01-01'",
    "SELECT * FROM healthrecords WHERE report LIKE '%High blood pressure%'",
    "SELECT v.prisonerid, COUNT(*) AS visitcount, p.name FROM visits v JOIN prisoners p ON p.prisonerid = v.prisonerid GROUP BY v.prisonerid, p.name",
    "SELECT c.cellid, c.capacity, c.currentoccupants FROM cells c",
    "SELECT crimename, 'High' AS severity FROM crimetypes WHERE crimename IN ('Theft', 'Assault', 'Murder')",
    "SELECT username, userid FROM Users WHERE username = 'admin'"
];

app.get('/query/:id', (req, res) => {
    const queryId = parseInt(req.params.id, 10);
    if (queryId >= 1 && queryId <= queries.length) {
        pool.query(queries[queryId - 1])
            .then(result => res.send(result.rows))
            .catch(err => res.status(400).send({ error: err.message }));
    } else {
        res.status(400).send({ error: "Invalid query ID" });
    }
    
});

// Insert endpoint
app.post('/insert', async (req, res) => {
    const data = req.body;

    try {
        const results = [];

        // Insert data for each table
        for (const [table, fields] of Object.entries(data)) {
            const columns = Object.keys(fields);
            const values = Object.values(fields);

            const query = `
                INSERT INTO ${table} (${columns.join(', ')})
                VALUES (${values.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING *;
            `;

            const result = await pool.query(query, values);
            results.push({ table, result: result.rows });
        }

        res.status(200).json(results);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
