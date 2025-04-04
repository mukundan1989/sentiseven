import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const connection = await mysql.createConnection({
      host: '13.234.110.203',
      user: 'stockstream_two',
      password: 'stockstream_two',
      database: 'stockstream_two',
    });

    const [rows] = await connection.execute(`
      SELECT date, comp_symbol, analyzed_articles, sentiment_score, sentiment, entry_price
      FROM news_signals_full
      WHERE (comp_symbol, date) IN (
        SELECT comp_symbol, MAX(date)
        FROM news_signals_full
        GROUP BY comp_symbol
      )
    `);

    await connection.end();
    res.status(200).json(rows);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Error fetching News signals' });
  }
};

export default handler;
