FROM rust:1.67
WORKDIR /database
COPY . .
RUN apt-get update && apt-get install -y libpq-dev && rm -rf /var/lib/apt/lists/*
RUN cargo install diesel_cli --no-default-features --features postgres
RUN diesel setup
EXPOSE 5432