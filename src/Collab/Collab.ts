import * as Y from 'yjs' ; 
import { WebsocketProvider } from 'y-websocket';

const ydoc = new Y.Doc() ;  //shared document

const CreateCollaborationConnection = (room_name : string) =>{
    const provider = new WebsocketProvider('wss://viscommerce.com/server' , room_name , ydoc , {connect : true } );
    console.log(provider);
}

export { ydoc , CreateCollaborationConnection }  ; 