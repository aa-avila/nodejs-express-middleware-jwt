const app = require('./app');

function main() {
    app.listen(app.get('port'), () => {
        console.log('Escuchando el puerto ', app.get('port'));
    });
}

main();