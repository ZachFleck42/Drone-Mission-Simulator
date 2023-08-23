# Drone Seeking / Tracking Mission Simulator
A Rust program that dynamically generates simulations of a drone searching for / tracking a target across randomly-generated hostile terrain. Uses Actix Web as a backend API to serve HTTP requests to and from the React UI. The simulations are rendered and animated in 3D on a WebGL canvas. Data retained in Postgres database via Diesel.
<br>

## Installation:
1. Run ```docker-compose up``` in the directory and wait for containers to start.
2. Application is now running. View the UI at http://localhost:3000 or send API requests directly to http://localhost:8080/sim<br>

## Usage / Tips:
See the tooltips next to each input field for a description of what each parameter will change.

Click & drag on the 3D simulation to pan the camera; hold shift + click & drag to move. Scroll to zoom in/out.

You can double-click any simulation in the history tab to set it as the active simulation.
