import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';//para comunicar xpress con io

import * as socket from '../sockets/sockets';

export default class Server {
    private static _instance: Server;

    public app: express.Application;
    public port: number;
    public io:socketIO.Server;//propiedad encargada de emitir eventos y escuchar
    public httpServer: http.Server;

    private constructor() {
        this.app = express(); 
        this.port = SERVER_PORT;

        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);
        
        this.escucharSockets();
    }
    public static get instance (){
        
        return this._instance || (this._instance = new this());

    }

    private escucharSockets(){
        
        console.log('escuchando conexiones - sockets');

        this.io.on('connection', cliente => { 
            

            console.log('nuevo cliente conectado con id:',cliente.id);
            // conectar cliente
            socket.conectarCliente(cliente,this.io);
            // login web socket , configurar usuario 
            socket.loginWS(cliente,this.io);
            // escuchar/obtener usuarios activos
            socket.obtenerUsuarios(cliente,this.io);
            // mensajes
            socket.mensaje(cliente, this.io);
            // desconectar
            socket.desconectar(cliente, this.io);

            
        });

        
    }

    start(callback: Function) {
        this.httpServer.listen(this.port , callback);
    }
}
