const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');

const app = express();

app.use(cors());
app.use(express.json());

// SQL Server connection using Windows Authentication + SQL Server Native Client
const dbConfig = {
    connectionString:
        'Driver={ODBC Driver 18 for SQL Server};' +
        'Server=localhost,1433;' +
        'Database=UnityBridgeDB;' +
        'Trusted_Connection=Yes;' +
        'TrustServerCertificate=Yes;'
};

sql.connect(dbConfig)
    .then(() => {
        console.log('Connected to SQL Server');
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });

// Route files
const signupRoutes = require('./SignUpServer');
const loginRoutes = require('./HomepageServer');
const postRoutes = require('./PostServer');

app.get('/api/posts', async function (req, res) {
    try {
        const pool = await sql.connect(dbConfig);

        const result = await pool.request().query(`
      SELECT 
        p.PostID,
        p.UserID,
        p.Title,
        p.Description,
        p.PostType,
        p.Status,
        p.ZipCode,
        p.CreatedAt,
        u.FirstName,
        u.LastName,
        u.Email
      FROM dbo.Posts p
      INNER JOIN dbo.Users u
        ON p.UserID = u.UserID
      ORDER BY p.CreatedAt DESC
    `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

app.use(signupRoutes);
app.use(loginRoutes);
app.use(postRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});