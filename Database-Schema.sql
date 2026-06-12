# 14-Database-Schema.sql

-- =====================================================
-- EXTENSIONS
-- =====================================================

create extension if not exists "uuid-ossp";

-- =====================================================
-- PROFILES
-- =====================================================

create table profiles (
id uuid primary key references auth.users(id) on delete cascade,

```
fullname text not null,

avatar_url text,

phone text,

city text,

university text,

faculty text,

role text not null default 'student',

created_at timestamptz default now(),

updated_at timestamptz default now()
```

);

create index idx_profiles_role on profiles(role);

-- =====================================================
-- ORGANIZERS
-- =====================================================

create table organizers (
id uuid primary key default gen_random_uuid(),

```
user_id uuid not null references profiles(id),

organization_name text not null,

description text,

logo_url text,

verified boolean default false,

created_at timestamptz default now()
```

);

-- =====================================================
-- CATEGORIES
-- =====================================================

create table event_categories (
id uuid primary key default gen_random_uuid(),

```
name text not null unique,

slug text not null unique
```

);

-- =====================================================
-- EVENTS
-- =====================================================

create table events (
id uuid primary key default gen_random_uuid(),

```
organizer_id uuid references organizers(id),

category_id uuid references event_categories(id),

title text not null,

slug text unique not null,

description text not null,

cover_image text,

location text not null,

city text not null,

latitude numeric,

longitude numeric,

start_date timestamptz not null,

end_date timestamptz not null,

status text default 'pending',

views integer default 0,

created_at timestamptz default now(),

updated_at timestamptz default now()
```

);

create index idx_events_city on events(city);
create index idx_events_status on events(status);
create index idx_events_start_date on events(start_date);

-- =====================================================
-- FAVORITES
-- =====================================================

create table favorites (
id uuid primary key default gen_random_uuid(),

```
user_id uuid references profiles(id),

event_id uuid references events(id),

created_at timestamptz default now(),

unique(user_id,event_id)
```

);

-- =====================================================
-- TICKETS
-- =====================================================

create table tickets (
id uuid primary key default gen_random_uuid(),

```
event_id uuid references events(id),

name text not null,

price numeric(12,2) not null,

quantity integer not null,

remaining integer not null,

created_at timestamptz default now()
```

);

-- =====================================================
-- ORDERS
-- =====================================================

create table orders (
id uuid primary key default gen_random_uuid(),

```
user_id uuid references profiles(id),

event_id uuid references events(id),

amount numeric(12,2),

status text default 'pending',

created_at timestamptz default now()
```

);

-- =====================================================
-- PAYMENTS
-- =====================================================

create table payments (
id uuid primary key default gen_random_uuid(),

```
order_id uuid references orders(id),

provider text,

provider_reference text,

amount numeric(12,2),

status text,

created_at timestamptz default now()
```

);

-- =====================================================
-- ISSUED TICKETS
-- =====================================================

create table issued_tickets (
id uuid primary key default gen_random_uuid(),

```
order_id uuid references orders(id),

ticket_id uuid references tickets(id),

qr_code text not null,

checked_in boolean default false,

checked_in_at timestamptz,

created_at timestamptz default now()
```

);

-- =====================================================
-- BOOSTS
-- =====================================================

create table boosts (
id uuid primary key default gen_random_uuid(),

```
event_id uuid references events(id),

boost_type text,

start_date timestamptz,

end_date timestamptz,

status text
```

);

-- =====================================================
-- ADS
-- =====================================================

create table ads (
id uuid primary key default gen_random_uuid(),

```
advertiser_name text not null,

banner_url text not null,

target_city text,

start_date timestamptz,

end_date timestamptz,

active boolean default true
```

);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

create table notifications (
id uuid primary key default gen_random_uuid(),

```
user_id uuid references profiles(id),

title text not null,

body text not null,

read boolean default false,

created_at timestamptz default now()
```

);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

create table audit_logs (
id uuid primary key default gen_random_uuid(),

```
actor_id uuid,

action text,

entity_type text,

entity_id uuid,

metadata jsonb,

created_at timestamptz default now()
```

);
