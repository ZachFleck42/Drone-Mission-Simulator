## Drone Seeking / Tracking Simulation
A Rust program that dynamically generates simulations of a drone searching for / tracking a target across randomly-generated hostile terrain. Uses Actix Web as a backend API to serve HTTP requests to and from the React UI. The simulations are rendered and animated in 3D on a WebGL canvas.
<br>

## Installation/Use:
1. Run ```docker-compose up``` in the directory and wait for containers to start.
2. Application is now running. View the UI at http://localhost:3000 or send API requests directly to http://localhost:8080/sim
   
You could also run the front and backends manually if you prefer (and have node and cargo installed already). Just run `npm start` in the frontend directory and `cargo run` in the backend directory.
