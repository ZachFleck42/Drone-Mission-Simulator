# Drone Seeking / Tracking Simulation
A Rust program that dynamically generates simulations of a drone searching for / tracking a target across randomly-generated hostile terrain. Uses Actix Web as a backend API to serve HTTP requests to and from the React UI. The simulations are rendered and animated in 3D on a WebGL canvas.

<br>

## Installation:
1. Run ```docker-compose up``` in the directory and wait for containers to start.
2. Application is now running. View the UI at http://localhost:3000 or send API requests directly to http://localhost:8080/sim
   
You could also run the front and backends manually if you prefer (and have node and cargo installed already). Just run `npm start` in the frontend directory and `cargo run` in the backend directory.
<br>

## Usage / Tips:
Click & drag scroll on the 3D simulation to pan the camera; hold shift + click & drag to move. Scroll to zoom in/out.

I'd recommend a maximum terrain size of 64; anything higher and the 3D-simulation looks ridiculous and the 2D-simulation tiles are just too small.
I'd also recommend a maximum hostile rate of 30; anything higher and the drone won't consistently be able to path across the terrain.

You can double-click any simulation in the history tab to set it as the active simulation.
