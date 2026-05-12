const express = require('express');
 const sql = require('mssql/msnodesqlv8');

 const router = express.Router();

 router.post('/api/requests', async (req, res) => {
   try {
     const { userId, title, description, zipCode } = req.body;

     if (!userId || !title || !description || !zipCode) {
       return res.status(400).send('UserID, title, description, and ZipCode are required.');
     }

     const result = await sql.query`
            INSERT INTO Posts
                (UserID, Title, Description, PostType, Status, ZipCode, CreatedAt, AcceptedResponseID)
            OUTPUT INSERTED.PostID
            VALUES
                (${userId}, ${title}, ${description}, 'Request', 'Open', ${zipCode}, GETDATE(), NULL)
        `;

     res.status(201).send({
       message: 'Request post created successfully!',
       postId: result.recordset[0].PostID
     });
   } catch (err) {
     console.error('Error saving request post:', err);
     res.status(500).send('Server error. Could not save request post.');
   }
 });

 router.post('/api/offers', async (req, res) => {
   try {
     const { userId, title, description, zipCode } = req.body;

     if (!userId || !title || !description || !zipCode) {
       return res.status(400).send('UserID, title, description, and ZipCode are required.');
     }

     const result = await sql.query`
            INSERT INTO Posts
                (UserID, Title, Description, PostType, Status, ZipCode, CreatedAt, AcceptedResponseID)
            OUTPUT INSERTED.PostID
            VALUES
                (${userId}, ${title}, ${description}, 'Offer', 'Open', ${zipCode}, GETDATE(), NULL)
        `;

     res.status(201).send({
       message: 'Offer post created successfully!',
       postId: result.recordset[0].PostID
     });
   } catch (err) {
     console.error('Error saving offer post:', err);
     res.status(500).send('Server error. Could not save offer post.');
   }
 });

 router.get('/api/users/:userId/posts', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({
                message: 'UserID is required.'
            });
        }

        const result = await sql.query`
            SELECT 
                PostID,
                UserID,
                Title,
                Description,
                PostType,
                Status,
                ZipCode,
                CreatedAt
            FROM Posts
            WHERE UserID = ${userId}
            ORDER BY CreatedAt DESC
        `;

        res.status(200).json({
            posts: result.recordset
        });

    } catch (err) {
        console.error('Error fetching user posts:', err);
        res.status(500).json({
            message: 'Server error. Could not fetch user posts.'
        });
    }
 });

 module.exports = router;
