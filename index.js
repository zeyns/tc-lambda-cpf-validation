const { Client } = require('pg');
const jwt = require('jsonwebtoken');

const client = new Client({
  user: '',
  host: '',
  database: '',
  password: '',
  port: 6432
})



exports.handler = async event => {
    const headers =  {
      'Content-Type': 'application/json',
    }
    const body = event.body;
    if(body.document) {
      client.connect(async err => {
          if (err) throw err;
          const res = await client.query(`select * from customer where document = ${body.document}`);
          if(res.rows) {
            const token = jwt.sign({ res.rows[0].id }, 'teste', { algorithm: 'RS256' });
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