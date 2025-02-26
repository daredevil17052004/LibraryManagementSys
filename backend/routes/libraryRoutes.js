const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const logger = require('../utils/logger'); // Import our logger

// API to fetch library statistics
router.get('/', async (req, res) => {
    try {
        logger.info('Fetching library statistics');
        
        // 1️⃣ Get books that have never been borrowed
        logger.debug('Querying for books that have never been borrowed');
        const [neverBorrowedResult] = await db.promisePool.query(`
            SELECT b.book_name, b.book_publisher as Author
            FROM book b
            LEFT JOIN issuance i ON b.book_id = i.book_id
            WHERE i.book_id IS NULL
        `);
        logger.debug(`Found ${neverBorrowedResult.length} books that have never been borrowed`);

        // 2️⃣ Get outstanding books (currently borrowed)
        logger.debug('Querying for outstanding books');
        const [outstandingBooksResult] = await db.promisePool.query(`
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
        logger.debug(`Found ${outstandingBooksResult.length} outstanding books`);

        // 3️⃣ Get top 10 most borrowed books
        logger.debug('Querying for top 10 most borrowed books');
        const [topBorrowedResult] = await db.promisePool.query(`
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
        logger.debug(`Retrieved top ${topBorrowedResult.length} most borrowed books`);

        // 4️⃣ Get pending returns for today
        logger.debug('Querying for pending returns for today');
        const [pendingReturnsResult] = await db.promisePool.query(`
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
        logger.debug(`Found ${pendingReturnsResult.length} pending returns for today`);

        logger.info('Successfully fetched all library statistics');
        res.json({
            never_borrowed: neverBorrowedResult,
            outstanding_books: outstandingBooksResult,
            top_borrowed: topBorrowedResult,
            pending_returns: pendingReturnsResult
        });

    } catch (err) {
        logger.error(`Failed to fetch library stats`, { error: err.message, stack: err.stack });
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
        logger.info(`Fetching pending returns for date: ${date}`);
        
        // Validate date format
        if (!date || isNaN(new Date(date).getTime())) {
            logger.warn(`Invalid date format provided`, { date });
            return res.status(400).json({ error: "Invalid date format" });
        }

        // Format date to ensure consistent format for DB query
        const formattedDate = new Date(date).toISOString().split('T')[0];
        
        logger.debug(`Executing query for pending returns`, { date: formattedDate });
        const [pendingReturnsResult] = await db.promisePool.query(`
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
        `, [formattedDate, formattedDate]);
        
        logger.debug(`Found pending returns`, { count: pendingReturnsResult.length, date: formattedDate });
        logger.info(`Successfully fetched pending returns`, { date: formattedDate });
        
        res.json({
            date: formattedDate,
            pending_returns: pendingReturnsResult
        });

    } catch (err) {
        logger.error(`Failed to fetch pending returns`, { 
            date: req.params.date,
            error: err.message,
            stack: err.stack
        });
        
        res.status(500).json({ 
            error: "Failed to fetch pending returns",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined 
        });
    }
});

module.exports = router;