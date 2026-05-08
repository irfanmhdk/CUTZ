create database cutz;
use cutz;

-- CREATE TABLE --
create table users (
                       Users_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                       Nama varchar(255),
                       Email VARCHAR(100) NOT NULL UNIQUE,
                       Password VARCHAR(255),
                       Role ENUM('Owner','Barber','Admin','Customer') DEFAULT 'Customer',
                       Pembuatan TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table barbershop (
                            Barbershop_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                            Users_id BIGINT NOT NULL,
                            Nama VARCHAR(255),
                            Alamat TEXT,
                            Hp varchar(20)
);

create table barbers (
                         Barbers_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                         Users_id BIGINT NOT NULL UNIQUE,
                         Barbershop_id BIGINT NOT NULL,
                         Pendapatan DECIMAL(5,2),
                         Status ENUM('Aktif','Tidak Aktif','Libur') DEFAULT 'Aktif'
);

create table services (
                          Services_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                          Barbershop_id BIGINT NOT NULL,
                          Nama_jasa VARCHAR(100),
                          harga DECIMAL(12,2),
                          Estimasi INT
);

create table bookings (
                          Bookings_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                          Users_id BIGINT NOT NULL,
                          Barbers_id BIGINT NOT NULL,
                          Services_id BIGINT NOT NULL,
                          Start_time DATETIME,
                          End_time DATETIME,
                          Total_harga DECIMAL(12,2),
                          Status_bayar ENUM('Menunggu Verifikasi','Sudah Bayar','Kadaluwarsa') DEFAULT 'Menunggu Verifikasi',
                          Bukti VARCHAR(255),
                          Bookings_status ENUM('Pending','Success','Gagal','Completed') DEFAULT 'Pending'
);

CREATE TABLE jadwal (
                        Jadwal_id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                        Barbershop_id BIGINT NOT NULL,
                        Hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'),
                        Jam_buka TIME,
                        Jam_tutup TIME,
                        Is_tutup BOOLEAN DEFAULT false
);
-- END CREATE TABLE --

-- ALTER TABLE --
ALTER TABLE barbershop
    ADD CONSTRAINT fk_barbershop_users
        FOREIGN KEY (Users_id) REFERENCES users(Users_id);

ALTER TABLE barbers
    ADD CONSTRAINT fk_barber_users
        FOREIGN KEY (Users_id) REFERENCES users(Users_id);

ALTER TABLE barbers
    ADD CONSTRAINT fk_barber_barbershop
        FOREIGN KEY (Barbershop_id) REFERENCES barbershop(Barbershop_id);

ALTER TABLE services
    ADD CONSTRAINT fk_services_barbershop
        FOREIGN KEY (Barbershop_id) REFERENCES barbershop(Barbershop_id);

ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_users
        FOREIGN KEY (Users_id) REFERENCES users(Users_id);

ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_barbers
        FOREIGN KEY (Barbers_id) REFERENCES barbers(Barbers_id);

ALTER TABLE bookings
    ADD CONSTRAINT fk_bookings_services
        FOREIGN KEY (Services_id) REFERENCES services(Services_id);

ALTER TABLE jadwal
    ADD CONSTRAINT fk_jadwal_barbershop
        FOREIGN KEY (Barbershop_id) REFERENCES barbershop(Barbershop_id);
-- END ALTER TABLE --

-- VIEW --
CREATE VIEW VBarbershop AS
SELECT
    barbershop.Nama AS Barbershop,
    users.Nama AS Owner,
    barbershop.Alamat AS Alamat,
    barbershop.Hp AS Telepon
FROM barbershop
         JOIN users ON barbershop.Users_id = users.Users_id;

CREATE VIEW VKapster AS
SELECT
    barbers.Barbers_id,
    users.Users_id,
    barbershop.Barbershop_id,
    users.Nama AS Kapster,
    barbershop.Nama AS Barbershop,
    barbers.Pendapatan AS Pendapatan,
    barbers.Status AS Status
FROM barbers
         JOIN users ON barbers.Users_id = users.Users_id
         JOIN barbershop ON barbers.Barbershop_id = barbershop.Barbershop_id;

CREATE VIEW VServis AS
SELECT
    services.Services_id,
    barbershop.Barbershop_id,
    barbershop.Nama AS Barbershop,
    services.Nama_jasa AS Layanan,
    services.Harga AS Harga,
    services.Estimasi AS Estimasi
FROM services
         JOIN barbershop ON services.Barbershop_id = barbershop.Barbershop_id;

CREATE VIEW VBookings AS
SELECT
    bookings.Bookings_id,
    customer.Users_id,
    barbers.Barbers_id,
    customer.Nama AS Customer,
    kapster.Nama AS Kapster,
    services.Nama_jasa AS Layanan,
    bookings.Start_time AS Waktu_mulai,
    bookings.End_time AS Waktu_selesai,
    bookings.Total_harga AS Harga,
    bookings.Status_bayar AS Status_bayar,
    bookings.Bukti AS Bukti,
    bookings.Bookings_status AS Status_bookings
FROM bookings
         JOIN users AS customer ON bookings.Users_id = customer.Users_id
         JOIN barbers ON bookings.Barbers_id = barbers.Barbers_id
         JOIN users AS kapster ON barbers.Users_id = kapster.Users_id
         JOIN services ON bookings.Services_id = services.Services_id;
-- END VIEW --

ALTER TABLE barbers ADD UNIQUE (Users_id);
SELECT * FROM VBookings;
UPDATE bookings SET Bookings_status = 'Success' WHERE Bookings_id = 16;