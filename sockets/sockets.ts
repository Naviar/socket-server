import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';

export const UsuariosConectados = new UsuariosLista();

// Conectar cliente
export const conectarCliente = (cliente:Socket, io: socketIO.Server) => {
    const usuario = new Usuario (cliente.id);
    UsuariosConectados.agregarUsuario(usuario);
    console.log('conectando cliente');
    
    
}

// Desconectar usuario
export const desconectar = (cliente : Socket , io:socketIO.Server)=>{
    
    cliente.on('disconnect',()=>{
        console.log('cliente desconectado');
        UsuariosConectados.borrarUsuario(cliente.id);
        io.emit('usuarios-activos',UsuariosConectados.getLista());
    });
}

// Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    
    cliente.on('mensaje',(payload:{de:string, cuerpo:string})=>{
        console.log('mensaje recibido', payload);

        io.emit('mensaje-nuevo',payload);        

    });
}

// LoginWebSocket , configurar usuario 
export const loginWS = (cliente:Socket , io :socketIO.Server)=>{
    
    
    cliente.on('configurar-usuario',(payload: {nombre:string}, callback: Function) =>{

        
        console.log('nombre login recibido:', payload.nombre);
        UsuariosConectados.actualizarNombre(cliente.id,payload.nombre);
        io.emit('usuarios-activos',UsuariosConectados.getLista());
        callback({
            ok: true, 
            mensaje: `usuario : ${payload.nombre} , configurado`
        })
        
    });
}

// obtener usuarios
export const obtenerUsuarios = (cliente:Socket , io :socketIO.Server)=>{
    
    
    cliente.on('obtener-usuarios',() =>{

        
        
        io.to(cliente.id).emit('usuarios-activos',UsuariosConectados.getLista());
        
        
    });
}
