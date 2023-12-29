# Vim Finesse (v0)

## Background

As amateur tetris players, we became interested in the concept of "finesse", which is making a move in tetris using the fewest keystrokes. While practicing zero finesse tetris, we arrived at the idea that we can apply a similar approach to Vim.

For those just starting out learning Vim using standard key bindings, it may be beneficial to see examples of how other more experienced users navigate everyday files in Vim, from moving to the end of the line and typing something to copy-pasting entire lines up or down.

Vim Finesse will give all users a set of these tasks and grant them the freedom to complete it in either the shortest amount of time or with the fewest keystrokes. By seeing the diverse ways people use Vim, we hope that everyone can better learn Vim -- even experienced users.

## Features (v0)

As a proof of concept, we will begin with a fixed set of tasks (e.g. delete "lorem" on line 3 starting at line 1), allowing users to asynchronously come up with their fastest and/or most efficient Vim keystrokes to accomplish this task. Upon completion, we will display a few examples from other users of fast and/or efficient key combinations to finish this task.

## Directory Structure

We choose to structure our directory in the following manner:

```
my_project/
├── Cargo.toml
├── build.rs
├── src/
│   ├── main.rs
│   ├── api/
│   │   ├── mod.rs
│   │   └── *.rs
│   │   └── ...
│   ├── models/
│   │   ├── mod.rs
│   │   └── *.rs
│   │   └── ...
│   ├── proto/
│   │   ├── mod.rs
│   │   └── *.rs
│   │   └── ...
│   └── ...
└── protos/
    └── *.proto
    └── ...
└── migrations/
    └── *.sql
    └── ...
```

- **Cargo.toml**: All `[dependencies]` and `[build-dependencies]` are defined here.
- **build.rs**: A custom build function for compiling protobuf to Rust using `prost_build` goes here.
- **src/main.rs**: Our server and all services defined in `src/api` are initialized here, including the logger and database connection.
- **src/api/**: This directory contains all the modules for making API requests. This is the core of `actix-web` functionality in our server, as well as `sqlx`.
- **src/models/**: This directory includes models that reflect the structure of our database. These are structs that can be serialized and deserialized.
- **src/proto/**: `protoc` and `prost_build` are used to compile everything in `protos` into Rust code. This includes documentation via `cargo docs`.
- **protos/**: We use this directory to define all request and response messages in protobuf, following the naming convention of `{Get/List/Update/Create}{Model}{Request/Response}` (for example, `CreateUserRequest`). Protobuf uses bytes, so we use a standard procedure for parsing this in our api (wip).
- **migrations/**: All database changes — creating, updating, or deleting tables — go here. With every change, the migrations in our database should accurately reflect the state of `src/models/`. See below for more information on migrations.

## Logging

Using `env_logger`, we will add the following import to all files using logging:
```
use log::{error, warn, info, debug, trace};
```

The corresponding macros (e.g. `warn!("Warning");`) will be used to create an output with a danger level and a timestamp.

## Getting started

In order to get a working local database, [install PostgresQL 16 here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads). Follow the instructions with:
```
username: "postgres"
password: "password"
```

We will be using the `sqlx` ORM with PostgresQL. First set the local database URL:

note: if your username and password are different here, change the username and password in the url accordingly
```
export DATABASE_URL="postgres://postgres:password@localhost/vim"
```

Next, open a psql shell and type in the above password. Create the local database vim.
```
> psql -U postgres
postgres=# CREATE DATABASE vim WITH ENCODING 'UTF8' LC_COLLATE='C' LC_CTYPE='C';
postgres=# \l
```

The last command will show you your tables, one of which should be vim.

Finally, after doing all this, you should see that main should compile:
```
cargo run
```

See below for the remaining steps of setup.

## Migrations

Our database will inevitably expand and change over time, meaning migrations must exist. We have raw `.sql` files for these migrations in `backend/backend-rs/migrations`, which should be auto-generated  and run using:
```
sqlx migrate add -r migration_name # creates reversible migration files
sqlx migrate run # applies migrations
sqlx migrate revert # reverts the migrations
```

Unfortunately migration scripts must be written manually and thus our database has no correspondence with the tables defined in `model/` without manual maintenance. We will try to keep this robust by having reversible migrations.

## Protobuf

We will use autogenerated protoc definitions using Google's `protoc`. The easiest way to get this is via homebrew:
```
brew install protoc
export PROTOC="/opt/homebrew/bin/protoc"
cargo build
```

For the above, your standard homebrew bin may vary, so you should check yours via `which protoc`, and use that for your environment variable.

Every time `./protos/*.proto` gets updated, running `cargo build` will auto-generate Rust code in `src/proto/*.rs` because of the code in `build.rs`. We will be using `./protos/` to define all request and response messages for every single API call.

## Frontend

installation steps:

`npm install @types/react @types/react-dom`
`npm install --save vim-wasm`
