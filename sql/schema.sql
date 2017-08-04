--SQL syntax should capitalize SQL commands while lowercasing table names and keys
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
    select id into newid from users where email = newemail;
    if newid is not null
    then
      newid := 0;
    else
      insert into users (email, pwhash) values (newemail, newpwhash)
      on conflict do nothing returning id into newid;
    end if;
    return;
    end;
  $$;

create function deleteuser(reqid integer, out deleted boolean)
  returns boolean language plpgsql as $$
    begin
    delete from users where id = reqid;
    deleted := found;
    return;
    end;
  $$;

create function getemail(reqid integer, out dbemail text)
  returns text language sql as $$
    select email as dbemail from users where id = reqid;
  $$;

create function getidpwhash(reqemail text, out dbid integer, out dbpwhash text)
  returns record language sql as $$
    select id as dbid, pwhash as dbpwhash from users where email = reqemail;
  $$;
