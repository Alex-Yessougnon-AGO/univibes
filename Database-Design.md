# 04-Database-Design.md

# Database Design

## users

```sql
id uuid
email varchar
created_at timestamp
```

---

## profiles

```sql
id uuid
user_id uuid
fullname varchar
avatar_url text
phone varchar
city varchar
university varchar
faculty varchar
created_at timestamp
```

---

## organizers

```sql
id uuid
user_id uuid
organization_name varchar
description text
logo_url text
verified boolean
created_at timestamp
```

---

## event_categories

```sql
id uuid
name varchar
slug varchar
```

---

## events

```sql
id uuid
organizer_id uuid
category_id uuid

title varchar
slug varchar

description text

cover_image text

location text

city varchar

latitude decimal
longitude decimal

start_date timestamp

end_date timestamp

status varchar

views integer

created_at timestamp
```

---

## tickets

```sql
id uuid
event_id uuid

name varchar

price decimal

quantity integer

remaining integer

created_at timestamp
```

---

## orders

```sql
id uuid

user_id uuid

event_id uuid

amount decimal

status varchar

created_at timestamp
```

---

## payments

```sql
id uuid

order_id uuid

provider varchar

provider_reference varchar

amount decimal

status varchar

created_at timestamp
```

---

## issued_tickets

```sql
id uuid

order_id uuid

ticket_id uuid

qr_code text

checked_in boolean

created_at timestamp
```

---

## favorites

```sql
id uuid

user_id uuid

event_id uuid

created_at timestamp
```

---

## boosts

```sql
id uuid

event_id uuid

boost_type varchar

start_date timestamp

end_date timestamp

status varchar
```

---

## ads

```sql
id uuid

advertiser_name varchar

banner_url text

target_city varchar

start_date timestamp

end_date timestamp
```

---

## notifications

```sql
id uuid

user_id uuid

title varchar

body text

read boolean
```

---

# Indexes

events.city

events.start_date

events.category_id

events.status

tickets.event_id

orders.user_id

payments.order_id

favorites.user_id

---

# RLS Policies

Utilisateur :

* lit ses données
* modifie ses données

Organisateur :

* gère ses événements

Admin :

* accès total

---

# Audit Logs

Tracer :

* suppression événement
* validation événement
* paiements
* changements de rôles
