create role pgauthmanager login;
comment on role pgauthmanager is 'Manager of user authentication';
create database pgauth owner pgauthmanager;
comment on database pgauth is 'User authentication database';
