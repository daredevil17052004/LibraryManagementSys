const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// API to fetch library statistics
router.get('/', async (req, res) => {
    try {
        // 1️⃣ Get books that have never been borrowed
        const [neverBorrowedResult] = await db.query(`
            SELECT b.book_name, b.book_publisher as Author
            FROM book b
            LEFT JOIN issuance i ON b.book_id = i.book_id
            WHERE i.book_id IS NULL
        `);

        // 2️⃣ Get outstanding books (currently borrowed)
        const [outstandingBooksResult] = await db.query(`
            SELECT 
                m.mem_name as Member_Name,
                b.book_name as Book_Name,
                i.issuance_date as Issued_Date,
                i.target_return_date as Target_Return_Date,
                b.book_publisher as Author
            FROM issuance i
            JOIN member m ON i.issuance_member = m.mem_id
            JOIN book b ON i.book_id = b.book_id
            WHERE i.issuance_status = 'issued' 
            AND CURRENT_DATE() <= i.target_return_date
            ORDER BY i.target_return_date
        `);

        // 3️⃣ Get top 10 most borrowed books
        const [topBorrowedResult] = await db.query(`
            SELECT 
                b.book_name,
                COUNT(i.book_id) as times_borrowed,
                COUNT(DISTINCT i.issuance_member) as unique_members_borrowed
            FROM book b
            JOIN issuance i ON b.book_id = i.book_id
            GROUP BY b.book_id, b.book_name
            ORDER BY times_borrowed DESC
            LIMIT 10
        `);

        // 4️⃣ Get pending returns for today
        const [pendingReturnsResult] = await db.query(`
            SELECT 
                m.mem_name,
                m.mem_phone,
                m.mem_email,
                b.book_name,
                b.book_publisher as Author,
                i.issuance_date,
                i.target_return_date,
                DATEDIFF(CURRENT_DATE(), i.target_return_date) as days_overdue
            FROM issuance i
            JOIN member m ON i.issuance_member = m.mem_id
            JOIN book b ON i.book_id = b.book_id
            WHERE i.issuance_status = 'issued'
            AND i.target_return_date = CURRENT_DATE()
            ORDER BY m.mem_name
        `);

        res.json({
            never_borrowed: neverBorrowedResult,
            outstanding_books: outstandingBooksResult,
            top_borrowed: topBorrowedResult,
            pending_returns: pendingReturnsResult
        });

    } catch (err) {
        console.error("Error fetching library stats:", err);
        res.status(500).json({ 
            error: "Failed to fetch library stats",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined 
        });
    }
});

// API to get pending returns for a specific date
router.get('/pending-returns/:date', async (req, res) => {
    try {
        const { date } = req.params;
        
        if (!date || !Date.parse(date)) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        const [pendingReturnsResult] = await db.query(`
            SELECT 
                m.mem_name,
                m.mem_phone,
                m.mem_email,
                b.book_name,
                b.book_publisher as Author,
                i.issuance_date,
                i.target_return_date,
                DATEDIFF(?, i.target_return_date) as days_overdue
            FROM issuance i
            JOIN member m ON i.issuance_member = m.mem_id
            JOIN book b ON i.book_id = b.book_id
            WHERE i.issuance_status = 'issued'
            AND DATE(i.target_return_date) = DATE(?)
            ORDER BY m.mem_name
        `, [date, date]);

        res.json({
            date,
            pending_returns: pendingReturnsResult
        });

    } catch (err) {
        console.error("Error fetching pending returns:", err);
        res.status(500).json({ 
            error: "Failed to fetch pending returns",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined 
        });
    }
});

module.exports = router;