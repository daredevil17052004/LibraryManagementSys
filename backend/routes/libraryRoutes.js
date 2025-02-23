const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// API to fetch library statistics
router.get('/', async (req, res) => {
    try {
        // 1️⃣ Get total books due
        const [totalBooksDueResult] = await db.query(
            "SELECT COUNT(*) AS total_books_due FROM issuance WHERE issuance_status = 'pending'"
        );
        const total_books_due = totalBooksDueResult[0].total_books_due;

        // 2️⃣ Get total members with books
        const [membersWithBooksResult] = await db.query(
            "SELECT COUNT(DISTINCT issuance_member) AS members_with_books FROM issuance WHERE issuance_status = 'pending'"
        );
        const members_with_books = membersWithBooksResult[0].members_with_books;

        // 3️⃣ Get total overdue books
        const [overdueBooksResult] = await db.query(
            "SELECT COUNT(*) AS overdue_books FROM issuance WHERE issuance_status = 'pending' AND target_return_date < NOW()"
        );
        const overdue_books = overdueBooksResult[0].overdue_books;

        // 4️⃣ Get pending books along with member details
        const [pendingBooksResult] = await db.query(`
                SELECT 
                    b.book_id, 
                    b.book_name, 
                    m.mem_name AS issued_to, 
                    i.issuance_date, 
                    i.target_return_date, 
                    i.issuance_status
                FROM issuance i
                JOIN book b ON i.book_id = b.book_id
                JOIN member m ON i.issuance_member = m.mem_id
                WHERE i.issuance_status IN ('pending', 'issued');
        `);

        // 5️⃣ Get books that were never borrowed
        const [neverBorrowedBooksResult] = await db.query(`
            SELECT book_name 
            FROM book 
            WHERE book_id NOT IN (SELECT DISTINCT book_id FROM issuance)
        `);
        const never_borrowed_books = neverBorrowedBooksResult.map(row => row.book_name);


        const [mostBorrowedBooksResult] = await db.query(`
            SELECT 
                b.book_id, 
                b.book_name, 
                COUNT(i.book_id) AS borrow_count
            FROM issuance i
            JOIN book b ON i.book_id = b.book_id
            GROUP BY b.book_id, b.book_name
            ORDER BY borrow_count DESC
            LIMIT 10;
        `);

        res.json({
            total_books_due,
            members_with_books,
            overdue_books,
            pending_books: pendingBooksResult,
            never_borrowed_books,
            mostBorrowedBooksResult
        });

    } catch (err) {
        console.error("Error fetching library stats:", err);
        res.status(500).json({ error: "Failed to fetch library stats" });
    }
});

module.exports = router;
