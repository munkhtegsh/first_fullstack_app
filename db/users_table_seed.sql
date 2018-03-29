create table if not exists users (
    id serial primary key,
    display_name text,    --make sure check user inputs varcar(100) if not they might crash the db
    auth_id text,
    img text
)