# sdc-rm
This is a repo for managing the replication managers .

The repo includes the following component subfolders:
- `./api`: A simple express.js API that queries a remote monitoring endpoint and displays replication manager version information in JSON format
- `./ui`: A simple react single page application that uses the aftermentioned api to display replication manager info through an interactive table

### API
This is a simple express application. It consists of a configuration file `config.js` with the following contents:
```
{
    "bind": "localhost",
    "port": 5000,
    "remote_url" : "https://remote_endpoint.example.foo/path/to/json",
    "verify": "false",
    "ratelimit_window_ms": 60000,
    "ratelimit_max_requests": 10 
}
```
- `bind`: address the api service will bind to 
- `port`: port the api service will bind to
- `remote_url`: remote endpoint to query the replication manager data from
- `verify`: ssl verify or not the remote endpoint
- `ratelimit_window_ms`: define a rate limit window in milliseconds
- `ratelimit_max_requests`: define how many requests are allowed during the above window

To deploy the API in a remote server behind nginx issue:
- Install nodejs - tested with nodejs `v.12.18.1`
- Donwload the `./api` subfolder's express project files to the remote node
- Issue: `npm install` inside the api project folder
- Use `pm2` to control the and daemonize the service. To install it issue `npm install -g pm2`, then:
 - Issue `pm2 start app.js` to start
 - Issue `pm2 startup systemd` to launch on system boot/restart

Lets say that the api starts listening on `localhost` port `5000`. To serve it through nginx add the following directive in the nginx server body configuration (either in default site config or in ssl.conf)
```
  location /api {
         proxy_pass http://localhost:5000/api;
    }
```
[!] Don't forget to configure the firewall rules...

### UI
The UI is a simple single page application build with ReactJS and it can be deployed in a remote node using the following steps:
- Enter `./ui` project folder
- Issue `node run build` to produce the optimized build
- Transfer the `./ui/dist` subfolder contents to the remote node's www root. Assuming you having nginx install that would be something like`/usr/share/nginx/html` on the remote node

Allow nginx to serve the files with the following directive in nginx server body configuration (either in default site config or in ssl.conf)
```
root /usr/share/nginx/html;
 
location / {
}
```

[!] Don't forget to configure the firewall rules...

