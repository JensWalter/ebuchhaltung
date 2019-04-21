
create table dokument(
  id varchar(36) primary key,
  datum timestamp,
  dateiinhalt longblob,
  dataitext longtext,
  dateiname varchar(100),
  status varchar(50) NOT NULL DEFAULT 'entwurf',
  beschreibung varchar(1000) NOT NULL DEFAULT ''
);

create table `position`(
  id varchar(36),
  version integer,
  dokument_id varchar(36),
  datum timestamp,
  typ varchar(50),
  beschreibung varchar(1000) NOT NULL DEFAULT '',
  brutto decimal NOT NULL DEFAULT 0,
  netto decimal NOT NULL DEFAULT 0,
  steuer decimal NOT NULL DEFAULT 0,
  status varchar(50) NOT NULL DEFAULT 'entwurf',
  primary key (id,version)
);

create table hinweis(
  id varchar(36) primary key,
  name varchar(50),
  wert varchar(500)
);

create table kontakt(
  id varchar(36) primary key,
  vorname varchar(100),
  nachname varchar(100),
  firmenname varchar(100),
  strasse varchar(100),
  postleitzahl integer,
  stadt varchar(100),
  land varchar(100),
  steuernummer varchar(100),
  steuerid varchar(100),
  status varchar(50)
);

create table buchung(
  id varchar(36) primary key,
  buchungsdatum timestamp,
  aenderungsdatum timestamp,
  gegenbuchung varchar(36),
  konto integer,
  betrag decimal,
  beschreibung varchar(1000),
  status varchar(50),
  position_id varchar(36)
);

create table dokument_dokument(
  dokument_id1 varchar(36),
  dokument_id2 varchar(36)
);
create table dokument_hinweis(
  dokument_id varchar(36),
  hinweis_id varchar(36)
);

create table position_hinweis(
  position_id varchar(36),
  position_version integer,
  hinweis_id varchar(36)
);

create table position_kontakt(
  position_id varchar(36),
  position_version integer,
  kontakt_id varchar(36)
);
