FROM rust:1.67
WORKDIR /simulator
COPY . .
RUN cargo install diesel_cli --no-default-features --features postgres && cargo build --release
EXPOSE 8080
CMD ["./target/release/simulator"]