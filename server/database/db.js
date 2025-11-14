import mysql from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'D1_92561_Pankaj',
    password:'manager',
    database:'movieReview'
})

export default pool;