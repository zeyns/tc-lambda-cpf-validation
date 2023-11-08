import * as jwt from 'jsonwebtoken';
import pg from 'pg'

const client = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});


export const handler = async event => {
    const headers =  {
      'Content-Type': 'application/json',
    }

    const responseReturn = (statusCode, body = null) => {
      if (body) {
        return { statusCode, headers, body }
      }
      return { statusCode, headers }
    }

    const body = event.body;
    if(body?.document) {
      client.connect(async err => {
          if (err) throw err;
          const { rows } = await client.query(`select * from customer where document = ${body.document}`);

          if(rows && rows.length > 0) {
            const token = jwt.sign({ customerId: rows[0].id }, process.env.JWT_SECRET_KEY, { algorithm: 'HS256' });
            return responseReturn(200, { token });
          }

          return responseReturn(401);
      });
    }
    return responseReturn(400);
};