insert into users (display_name, auth_id, img)
values ($1, $2, $3)

-- delete or insert doesn't return anything so use returning
RETURNING *; --it will return newly inserted user