create table if not exists leads (
  id bigint generated always as identity primary key,
  nome text not null,
  whatsapp text not null default '',
  concessionaria text not null default '',
  rodovia text not null default '',
  mensagem text not null default '',
  origem text not null default 'anuncio',
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);
