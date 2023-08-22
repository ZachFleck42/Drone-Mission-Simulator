// @generated automatically by Diesel CLI.

diesel::table! {
    simulations (id) {
        id -> Int4,
        generated_id -> Varchar,
        generated_time -> Int8,
        no_frames -> Int4,
        grid_size -> Int4,
        hostile_rate -> Int2,
        move_rate -> Int2,
        drone_move_range -> Int2,
        drone_vis_range -> Int2,
    }
}

diesel::table! {
    simulation_frames (id) {
        id -> Int4,
        sim_id -> Nullable<Int4>,
        frame_no -> Int4,
        environment -> Jsonb,
        drone -> Jsonb,
    }
}

diesel::joinable!(simulation_frames -> simulations (sim_id));

diesel::allow_tables_to_appear_in_same_query!(simulation_frames, simulations,);
