import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

//image filter api
  app.get( "/filteredimage/", ( req: Request, res: Response ) => {
    let { image_url } = req.query;
    if ( !image_url ) {
      return res.status(400).send("The image url is required");
    }    
    filterImageFromURL(image_url)
      .then(filteredpath => {
        return res.status(200).sendFile(filteredpath, err => {
          if (!err) {
            let filesList: string[] = [filteredpath];
            deleteLocalFiles(filesList);
          }
        });
      }).catch(() => {
        return res.status(422).send("error while processing the image url");
      });
  } );  

  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();