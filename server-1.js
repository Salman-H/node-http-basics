/*
    A simple http server that returns a Hello World message 
    when it receives a request

    @author: Salman Hashmi
*/

// include node http module
var http = require('http');

// these can be changed any time to reconfigure the server
var hostname = 'localhost';
var port = 3000;

// create the server
// createServer function itself takes a callback function as a parameter
// which gives us access to the request and response messages that will be
// synced by this http server
var server = http.createServer( 
                                    function(request, response){
                                        console.log(request.headers);
                                        response.writeHead(200, { 'Content-Type': 'text/html' });
                                        response.end('<html><body><h1>Hello World!</h1></body></html>');
                                    } 
                                );
                                
// start the server
// The third parameter in the following call to listen is a function that will be
// called once the server starts
server.listen(port, hostname, 
                                function() {
                                    //console.log("Server running at http://${hostname}:${port}/");
                                    console.log("Server running at http://" + hostname + ":" + port + "/");
                                         }
);
