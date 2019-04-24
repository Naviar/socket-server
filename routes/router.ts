import {Router,Request,Response} from 'express';
import Server from '../classes/server';
import { UsuariosConectados } from '../sockets/sockets';

export const router = Router();

router.get('/mensajes',(req:Request , res:Response)=>{
    res.json({
        ok: true,
        mensaje: ' GET todo esta bien!'
    })
});

router.post('/mensajes',(req:Request , res:Response)=>{
    
    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;

    const payload = {
        cuerpo,
        de
    }
    
    const server = Server.instance;

    server.io.emit('mensaje-nuevo',payload);

    res.json({
        ok: true,
        cuerpo,
        de
    })
});

router.post('/mensajes/:id',(req:Request , res:Response)=>{
    
    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;

    const payload = {
        de,
        cuerpo
    }
    
    const server = Server.instance;// instancia servidor 

    server.io.in(id).emit('mensaje-privado',payload);

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    })
});

// servicio para obtener todos los ids de los usuarios conectados
router.get('/usuarios', (req:Request,res:Response)=>{
    
    const server = Server.instance; // instancia del servidor
    
    //barrer todos los cientes conectados
    server.io.clients((err : any,clientes: string[]) =>{
        
        if(err){
            return res.json({
                ok:false,
                err
            })
        }

        res.json({
            ok:true,
            clientes
        })

    });

});

// servicio para obtener usuarios y sus nombress
router.get('/usuarios/detalle',(req:Request,res:Response) => {

    res.json({
    
        ok:true,
        clientes: UsuariosConectados.getLista()

    });

});

export default router;