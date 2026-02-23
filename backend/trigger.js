import http from 'http';

http.get('http://localhost:5000/api/patients/697cbea6b3aa281cef71d5b1', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`BODY: ${data}`);
        process.exit();
    });
}).on('error', (err) => {
    console.error(err.message);
    process.exit(1);
});
