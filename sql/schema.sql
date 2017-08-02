create table users (
  id serial,
  ident integer primary key,
  email text not null,
  pwhash text not null
);

comment on table users is 'registered users';
comment on column users.id is 'ID base';
comment on column users.ident is 'ID';
comment on column users.email is 'email address';
comment on column users.pwhash is 'bcrypt hash with salt of password';

create function adduser(newemail text, newpwhash text, out newident integer)
  returns integer language plpgsql as $$
    setseed(sin(currenttime);
    newid := insert into users (email, pwhash) values (newemail, newpwhash)
      returning id;
    newident := update users set ident = trunc(1000 * (id + random()))
      where id = newid;
    return;
  $$;

create function getemail(reqident integer, out dbemail text)
  returns text language sql as $$
    select email as dbemail from users where ident = reqident;
  $$;

create function getpwhash(reqemail text, out dbpwhash text)
  returns text language sql as $$
    select pwhash as dbpwhash from users where email = reqemail;
  $$;
