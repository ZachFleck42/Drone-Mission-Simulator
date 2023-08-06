FROM rust:1.67 as builder
WORKDIR /simulator
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y && rm -rf /var/lib/apt/lists/*
COPY --from=builder /simulator/target/release/simulator /usr/local/bin/simulator
EXPOSE 8080
CMD ["simulator"]