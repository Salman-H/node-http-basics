/*
    http server v2 serves 2 small webpages using the
    file system 'fs' and 'path' node modules 

    @author: Salman Hashmi
*/

// include node http module
var http = require('http');

/* 
    include the 'fs' node module to be able to perform 
    queries and retrieve and manipulate files
*/
var fs = require('fs');

/*
   include the 'path' node module to be able to construct
   the path appropriate to the specific machine
   e.g. OSX uses forward slahes in paths whereas 
    Windows paths contain back slahes 
*/
var path = require('path');


// these can be changed any time to reconfigure the server
var hostname = 'localhost';
var port = 3000;


/*
    Construct the Server

    createServer function itself takes a callback function as a parameter
    which gives us access to the request and response messages that will be
    synced by this http server.

    In other words, once the server is created, i.e. the request message sent 
    and the response message received, the callback function (below) which is 
    passed as the parameter to the createServer function call, will be called 
    back with these request and response messages from the createServer function 
    (inside the http node module) to be handled by us here according to our 
    preferences.

*/

var server = http.createServer( 
                                    function(request, response) {

                                        // we print request message info like the type
                                        // of request method to ensure it's the GET method
                                        console.log('Request for ' + request.url + 
                                            ' by method ' + request.method);

                                        // we will only handle the GET method here and ignore
                                        // any other method
                                        if (request.method == 'GET') {
                                            var fileUrl;
                                           
                                            /*
                                                We need to handle the case where the request url
                                                did not specify any specific page of the site i.e.
                                                a request url of localhost:3000/ ends at the forward
                                                slash. 

                                                In this case, we are going to interpret
                                                the request as requesting the main page of the
                                                side i.e. the index.html file, and since it is
                                                not explicitely included in the request message,
                                                we have to add it to the fileUrl
                                            */
                                            if (request.url == '/') fileUrl = '/index.html';

                                            /*
                                                otherwise, we access the url to see which specific
                                                file is being requested from our server
                                            */
                                            else fileUrl = request.url;

                                            /*
                                                Construct absolute path to requested file

                                                path.resolve(fileDirectory) constructs the absolute 
                                                path to the requested file starting at the root i.e. 
                                                fills in the path from the root till the fileDirectory
                                                and appends to this path the fileDirectory
                                                e.g. fileUrl of localhost:3000/about will have a path
                                                consisting of the root prefix (till /public/about), i.e.
                                                C/Users/Salman/Documents/HKUST Full-Stack Course 5/
                                                node-http plus whatever fileDirectory is passed as 
                                                a parameter to the resolve function,
                                                in this case, /public/about
                                            */
                                            var filePath = path.resolve('./public' + fileUrl);

                                            /*
                                                next, extract the extension of the file name from 
                                                the path provided to the file (stored in filePath)
                                                e.g. C/Users/Salman/..../node-http/public/about is 
                                                a path to the file about with extension .html
                                            */
                                            var fileExt = path.extname(filePath);

                                            // we are going to ignore all files other than html
                                            // because our current server only handels html files
                                            if (fileExt == '.html') {

                                                // now we use the fs module to check that the
                                                // requested html file atually exists in our server
                                                fs.exists(filePath, 
                                                                    function(exists) {

                                                                        // if file does not exist in our server,
                                                                        if (!exists) {

                                                                            // Respond with 404; HTTP code for not found
                                                                            response.writeHead(404, { 'Content-Type': 'text/html'});
                                                                            response.end('<h1>Error 404: ' + fileUrl + ' not fount</h1>');
                                                                            return;
                                                                        }
                                                                        // otherwise, if file DOES exits (we did not exit/return
                                                                        // from this function in the if block),

                                                                        // Respond with 200; HTTP code for OK,
                                                                        response.writeHead(200, { 'Content-Type': 'text/html'});

                                                                        /*
                                                                            then construct the rest of the response message:
                                                                            read the file as a stream, and 
                                                                            pipe the file to the response message
                                                                            which will be sent back to the client side
                                                                        */
                                                                        fs.createReadStream(filePath).pipe(response);
                                                                    }       
                                                            ); 
                                            }
                                            // else, if file is not html
                                            else {
                                                response.writeHead(404, { 'Content-Type': 'text/html'});
                                                response.end('<h1>Error 404: ' + fileUrl + ' not a HTML file</h1>');
                                            }
                                        }
                                        // else, if other than a GET message
                                        else {
                                            // respond with 501; HTTP code for Not Implemented/Supported
                                            response.writeHead(501, { 'Content-Type': 'text/html'});
                                            response.end('<h1>Error 501: ' + request.method + ' not supported</h1>');
                                        }
                                       
                                    } 
                                );

/*
    start the server
    The third parameter in the following call to listen is a function that will be
    called once the server starts
    This server can be tested by sending different requests using the Chrome Postman extension
*/                                
server.listen(port, hostname, 
                                function() {
                                    //console.log("Server running at http://${hostname}:${port}/");
                                    console.log("Server running at http://" + hostname + ":" + port + "/");
                                         }
);
