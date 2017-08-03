create table users (
  id serial primary key,
  email text not null unique,
  pwhash text not null
);

comment on table users is 'registered users';
comment on column users.id is 'ID';
comment on column users.email is 'email address';
comment on column users.pwhash is 'bcrypt hash with salt of password';

create function adduser(newemail text, newpwhash text, out newid integer)
  returns integer language plpgsql as $$
    begin
    perform setseed(sin(currenttime));
    insert into users (email, pwhash) values (newemail, newpwhash)
      returning id into newid;
    return;
    end;
  $$;

create function getemail(reqid integer, out dbemail text)
  returns text language sql as $$
    select email as dbemail from users where id = reqid;
  $$;

create function getpwhash(reqemail text, out dbpwhash text)
  returns text language sql as $$
    select pwhash as dbpwhash from users where email = reqemail;
  $$;
