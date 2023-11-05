const { Client } = require('pg');
const jwt = require('jsonwebtoken');

const client = new Client({
  user: '',
  host: '',
  database: '',
  password: '',
  port: 6432
})

const JWT_SECRET_KEY = 'asl292@_asda2rg546'

exports.handler = async event => {
    const headers =  {
      'Content-Type': 'application/json',
    }
    const body = event.body;
    if(body.document) {
      client.connect(async err => {
          if (err) throw err;
          const { rows } = await client.query(`select * from customer where document = ${body.document}`);

          if(rows && rows.length > 0) {
            const token = jwt.sign({ customerId: res.rows[0].id }, JWT_SECRET_KEY, { algorithm: 'HS256' });
            return  {
              statusCode: 200,
              headers,
              body: {
                token
              }
            }
          } 
          return {
            statusCode: 401,
            headers
          }
      });
    }
    return {
      statusCode: 400,
      headers
    }

};