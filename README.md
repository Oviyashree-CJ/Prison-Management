# Prison Management System

A Prison Management System built as a **Database Management System (DBMS)** mini-project using **PostgreSQL**. This system is designed to manage records of prisoners, cells, visitors, crimes, and parole details efficiently.

---

##  Project Description

This project helps to digitize and manage the administrative tasks of a prison. It maintains:
- Prisoner details
- Crime and sentence information
- Cell and block allocations
- Guards details
- Visitor management

---

## Tech Stack

- **Database**: PostgreSQL
- **Query Language**: SQL (DDL, DML, DCL, TCL)
- **Frontend**: HTML, CSS, JS
- **Tools Used**: pgAdmin, psql

---

## Features

- Add, view, update, and delete prisoner records
- Add and manage guards
- Visitor log and timing
- Record crime details and sentence durations

---

## Sample Queries

```sql
    SELECT * FROM Prisoners
    SELECT * FROM Guards
    SELECT Name, DOB FROM Prisoners WHERE SentenceYears > 5
    SELECT * FROM Visits
    SELECT * FROM Users
    SELECT prisonercrimes.recordid, prisoners.name, crimetypes.crimename FROM prisonercrimes JOIN prisoners ON prisonercrimes.prisonerid = prisoners.prisonerid JOIN crimetypes ON prisonercrimes.crimeid = crimetypes.crimeid
    SELECT * FROM HealthRecords
    SELECT * FROM CrimeTypes
    SELECT * FROM Cells
    SELECT COUNT(*) AS TotalPrisoners FROM prisoners

```
---
By 
Abinaya Sri M
Oviyashree C J
Janani S
KaviPriya R
