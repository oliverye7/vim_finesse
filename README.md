# Vim Finesse (v0)

## Background

As amateur tetris players, we became interested in the concept of "finesse", which is making a move in tetris using the fewest keystrokes. While practicing zero finesse tetris, we arrived at the idea that we can apply a similar approach to Vim.

For those just starting out learning Vim using standard key bindings, it may be beneficial to see examples of how other more experienced users navigate everyday files in Vim, from moving to the end of the line and typing something to copy-pasting entire lines up or down.

Vim Finesse will give all users a set of these tasks and grant them the freedom to complete it in either the shortest amount of time or with the fewest keystrokes. By seeing the diverse ways people use Vim, we hope that everyone can better learn Vim -- even experienced users.

## Features (v0)

As a proof of concept, we will begin with a fixed set of tasks (e.g. delete "lorem" on line 3 starting at line 1), allowing users to asynchronously come up with their fastest and/or most efficient Vim keystrokes to accomplish this task. Upon completion, we will display a few examples from other users of fast and/or efficient key combinations to finish this task.

# Logging

Using `env_logger`, we will add the following import to all files using logging:
```
use log::{error, warn, info, debug, trace};
```

The corresponding macros (e.g. `warn!("Warning");`) will be used to create an output with a danger level and a timestamp.

# Database and Local Run

In order to get a working local database, [install PostgresQL 16 here](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads). Follow the instructions with:
```
username: "postgres"
password: "password"
```

We will be using the `sqlx` ORM with PostgresQL. First set the local database URL:
```
export DATABASE_URL="postgres://postgres:password@localhost/vim"
```

Next, open a psql shell and type in the above password. Create the local database vim.
```
> psql -U postgres
postgres=# CREATE DATABASE vim WITH ENCODING 'UTF8' LC_COLLATE='C' LC_CTYPE='C';
\l
```

The last command will show you your tables, one of which should be vim.

Finally, after doing all this, you should see that your local database should now work:
```
cargo run
```

More to come in the future
