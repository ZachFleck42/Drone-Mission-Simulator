CREATE TABLE simulations (
  id SERIAL PRIMARY KEY,
  generated_id VARCHAR NOT NULL,
  generated_time BIGINT NOT NULL,
  no_frames INT NOT NULL,
  grid_size INT NOT NULL,
  hostile_rate SMALLINT NOT NULL,
  move_rate SMALLINT NOT NULL,
  drone_move_range SMALLINT NOT NULL,
  drone_vis_range SMALLINT NOT NULL,
  frames JSONB NOT NULL
);