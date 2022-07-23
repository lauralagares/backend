
const DATABASE_NAME = 'Laurify';
const COLLECTION_NAME = 'Favorites';

export const getAllFavorites = async (req, res) => {
    const client = req.query.id
    const query = { name: client };
    //decir quien es el cliente a la funcion para traer favoritos de mi perfil 
    const db = req.app.locals.ddbbClient.db(DATABASE_NAME);
    const col = db.collection(COLLECTION_NAME); 
    const favorites = await col.findOne(query); 
    res.json(favorites); 
}

export const addFavorites = async (req, res) => {
    const client = req.body.name //id del cliente
    const track = req.body.track //id del track
    const db = req.app.locals.ddbbClient.db(DATABASE_NAME); //bbdd
    const col = db.collection(COLLECTION_NAME); // coleccion
    const query = { name: client }; // id del cliente
    const update = { // set y addtoset
        $set: { name: client },
        $addToSet: { tracks: track }
    }
    const options = { upsert: true }; // upsert crea documento sino existe y actualiza si existe
    await col.updateOne(query, update, options); 
    res.json({});
}

export const deleteFavorites = async (req, res) => {
    const client = req.query.name //id del cliente
    const track = req.query.track //id del track
    const db = req.app.locals.ddbbClient.db(DATABASE_NAME); //bbdd
    const col = db.collection(COLLECTION_NAME); // coleccion
    const query = { name: client }; // id del cliente
    const update = { // set y pull
        $pull: { tracks: track }
    }
    //const options = { upsert: true };  upsert crea documento sino existe y actualiza si existe
    const r = await col.updateOne(query, update); 
    console.log(r)
    res.json({});
}