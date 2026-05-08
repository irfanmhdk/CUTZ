//#region ===== BARBERSHOP =====
const BARBER_URL = 'http://localhost:4000/api/barbershop';
let isEditBarber = false;
let barberIdUp = null;
const searchb = document.getElementById('searchb');

// Tampil/Sembunyi Form
function showBarberForm() {
    isEditBarber = false;
    barberIdUp = null;

    document.getElementById('barberFormContainer').style.display = 'block';
}

function hideBarberForm() {
    document.getElementById('barberFormContainer').style.display = 'none';
    document.getElementById('barberForm').reset();
    isEditBarber = false;
}

// 1. Ambil Data (READ)
async function refreshBarberTable(query = '') {
    try {
        const url = query ? `${BARBER_URL}?q=${encodeURIComponent(query)}` : BARBER_URL;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Gagal mengambil data');

        const data = await response.json();
        const tbody = document.querySelector('#barberTable tbody');
        tbody.innerHTML = '';

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="fw-bold">${item.Barbershop}</span></td>
                <td>${item.Owner}</td>
                <td>${item.Telepon}</td>
                <td><small>${item.Alamat}</small></td>
                <td class="text-center">
                    <div class="btn-group">
                        <button onclick="editBarber('${item.Barbershop_id}', '${item.Barbershop}', '${item.Telepon}', '${item.Alamat}', '${item.Users_id}')" class="btn btn-sm btn-outline-info">Edit</button>
                        <button onclick="hapusBarber('${item.Barbershop_id}')" class="btn btn-sm btn-outline-danger">Hapus</button>
                    </div>
                </td>`;
            tbody.appendChild(tr);
        });
    } catch (err) { console.error(err); }
}

searchb.addEventListener('input', (e) => {
    refreshBarberTable(e.target.value);
});

// 2. Simpan & Update (CREATE & UPDATE)
document.getElementById('barberForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userIdValue = document.getElementById('userIdBarber').value;
    console.log("Nilai User ID dari input:", userIdValue);

    const payload = {
        Users_id: parseInt(userIdValue),
        Nama: document.getElementById('namaBarber').value,
        Alamat: document.getElementById('alamatBarber').value,
        Hp: document.getElementById('hpBarber').value
    };

    const method = isEditBarber ? 'PUT' : 'POST';
    const url = isEditBarber ? `${BARBER_URL}/${barberIdUp}` : BARBER_URL;

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert('Data Barbershop diperbarui!');
        hideBarberForm();
        refreshBarberTable();
    }
});

// 3. Persiapan Edit
function editBarber(id, nama, hp, alamat, userId) {
    showBarberForm();
    isEditBarber = true;
    barberIdUp = id;
    document.getElementById('namaBarber').value = nama;
    document.getElementById('hpBarber').value = hp;
    document.getElementById('alamatBarber').value = alamat;
    document.getElementById('userIdBarber').value = userId;
    document.getElementById('submitBarber').innerText = 'Update Cabang';
}

// 4. Hapus (DELETE)
async function hapusBarber(id) {
    if (confirm('Hapus cabang ini?')) {
        await fetch(`${BARBER_URL}/${id}`, { method: 'DELETE' });
        refreshBarberTable();
    }
}

refreshBarberTable();
//#endregion ===== END BARBERSHOP =====

//#region ===== USERS =====
// Fungsi ini bisa dipakai untuk select mana pun
async function isiDropdownCabang(idElemen, idTerpilih = null) {
    const selectElemen = document.getElementById(idElemen);
    if (!selectElemen) return; // Jaga-jaga jika elemen tidak ditemukan

    try {
        const response = await fetch(BARBER_URL);
        const data = await response.json();

        selectElemen.innerHTML = '<option value="">-- Pilih Cabang --</option>';

        data.forEach(item => {
            const option = document.createElement('option');
            // Pastikan properti ini (Barbershop_id & Barbershop) sama dengan data API kamu
            option.value = item.Barbershop_id;
            option.textContent = item.Barbershop;

            if (idTerpilih && item.Barbershop_id == idTerpilih) {
                option.selected = true;
            }
            selectElemen.appendChild(option);
        });
    } catch (err) {
        console.error("Gagal memuat cabang untuk " + idElemen, err);
    }
}

const USER_URL = 'http://localhost:4000/api/users';
let isEditUser = false;
let userIdUp = null;
const searchu = document.getElementById('searchu');

// Tampil/Sembunyi Form
function showUserForm() {
    isEditUser = false;
    userIdUp = null;
    document.getElementById('userForm').reset();
    document.getElementById('submitUserBtn').innerText = 'Simpan User';
    document.getElementById('userFormContainer').style.display = 'block';
}

function hideUserForm() {
    document.getElementById('userFormContainer').style.display = 'none';
}

// 1. Ambil Data (READ)
async function refreshUserTable(query = '') {
    try {
        const url = query ? `${USER_URL}?q=${encodeURIComponent(query)}` : USER_URL;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Gagal mengambil data');

        const data = await response.json();
        const tbody = document.querySelector('#userTable tbody');
        tbody.innerHTML = '';

        data.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="fw-bold">${user.Nama}</span></td>
                <td>${user.Email}</td>
                <td><span class="badge bg-info text-dark">${user.Role}</span></td>
                <td class="text-center">
                    <div class="btn-group">
                        <button onclick="editUser('${user.Users_id}', '${user.Nama}', '${user.Email}', '${user.Role}')" 
                                class="btn btn-sm btn-outline-info">Edit</button>
                        <button onclick="hapusUser('${user.Users_id}')" 
                                class="btn btn-sm btn-outline-danger">Hapus</button>
                    </div>
                </td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Gagal ambil data user:", err);
    }
}

searchu.addEventListener('input', (e) => {
    refreshUserTable(e.target.value);
});

// Role Cek Cek
document.getElementById('userRole').addEventListener('change', async (e) => {
    const container = document.getElementById('barbershopSelectContainer');
    // Pastikan ID select di dalam fungsi ini sama dengan ID di HTML kamu
    const idSelect = 'userBarbershopId';

    if (e.target.value === 'Barber') {
        // 1. Isi datanya dulu
        await isiDropdownCabang(idSelect);

        // 2. TAMPILKAN kontainernya (Penting!)
        container.style.display = 'block';

        // Tambahkan required agar admin wajib memilih cabang
        document.getElementById(idSelect).required = true;
    } else {
        // Sembunyikan jika role bukan Barber
        container.style.display = 'none';
        document.getElementById(idSelect).required = false;
        document.getElementById(idSelect).value = '';
    }
});

// 2. Simpan & Update (CREATE & UPDATE)
document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        Nama: document.getElementById('userName').value,
        Email: document.getElementById('userEmail').value,
        Role: document.getElementById('userRole').value,
        Pw: document.getElementById('userPw').value,
        Bar: document.getElementById('userBarbershopId').value || null
    };

    const method = isEditUser ? 'PUT' : 'POST';
    const url = isEditUser ? `${USER_URL}/${userIdUp}` : USER_URL;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert(isEditUser ? 'User diperbarui!' : 'User berhasil ditambahkan!');
            hideUserForm();
            refreshUserTable();
        } else {
            const errData = await res.json();
            alert("Error: " + errData.error);
        }
    } catch (err) {
        console.error("Gagal proses user:", err);
    }
});

// 3. Persiapan Edit
function editUser(id, nama, email, role) {
    showUserForm(); // Munculkan container
    isEditUser = true;
    userIdUp = id;

    document.getElementById('userName').value = nama;
    document.getElementById('userEmail').value = email;
    document.getElementById('userRole').value = role;
    document.getElementById('submitUserBtn').innerText = 'Update User';
}

// 4. Hapus (DELETE)
async function hapusUser(id) {
    if (confirm('Yakin ingin menghapus user ini?')) {
        try {
            const res = await fetch(`${USER_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) refreshUserTable();
        } catch (err) {
            console.error("Gagal hapus user:", err);
        }
    }
}

// Inisialisasi awal
refreshUserTable();
//#endregion ===== END USERS =====

//#region ===== BARBERS/KAPSTER =====
const KAPS_URL = 'http://localhost:4000/api/barbers';
let isEditBarberDetail = false;
let barberDetailIdUp = null;
const searchk = document.getElementById('searchk');

document.addEventListener('DOMContentLoaded', () => {
    isiDropdownCabang('kaps');
});

// 1. Ambil Data (READ)
async function refreshBarberDetailTable(query = '') {
    try {
        const url = query ? `${KAPS_URL}?q=${encodeURIComponent(query)}` : KAPS_URL;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Gagal mengambil data');

        const data = await response.json();
        const tbody = document.querySelector('#barberDetailTable tbody');
        tbody.innerHTML = '';

        data.forEach(k => {
            const tr = document.createElement('tr');
            // Warna badge berdasarkan status
            const badgeClass = k.Status === 'Aktif' ? 'bg-success' : (k.Status === 'Libur' ? 'bg-warning' : 'bg-danger');

            tr.innerHTML = `
                <td><span class="fw-bold">${k.Kapster}</span></td>
                <td>${k.Barbershop}</td>
                <td>${parseFloat(k.Pendapatan)} %</td>
                <td><span class="badge ${badgeClass}">${k.Status}</span></td>
                <td class="text-center">
                    <button onclick="editBarberDetail('${k.Barbers_id}', '${k.Status}', '${k.Pendapatan}')" 
                            class="btn btn-sm btn-outline-info">Edit</button>
                    <button onclick="hapusBarberDetail('${k.Barbers_id}')" 
                            class="btn btn-sm btn-outline-danger">Hapus</button>
                </td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Gagal ambil data detail barber:", err);
    }
}

searchk.addEventListener('input', (e) => {
    refreshBarberDetailTable(e.target.value);
});

// 2. Persiapan Edit
function editBarberDetail(id, status, pendapatan) {
    document.getElementById('barberDetailFormContainer').style.display = 'block';
    isEditBarberDetail = true;
    barberDetailIdUp = id;

    document.getElementById('statusBarber').value = status;
    // Masukkan angka murni (misal: 10.5)
    document.getElementById('pendapatanBarber').value = parseFloat(pendapatan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideBarberDetailForm() {
    document.getElementById('barberDetailFormContainer').style.display = 'none';
    document.getElementById('barberDetailForm').reset();
}

// 3. Update Data (UPDATE)
document.getElementById('barberDetailForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        Barbershop: document.getElementById('kaps').value,
        Status: document.getElementById('statusBarber').value,
        Pendapatan: parseFloat(document.getElementById('pendapatanBarber').value)
    };

    try {
        const res = await fetch(`${KAPS_URL}/${barberDetailIdUp}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Data barber berhasil diperbarui!');
            hideBarberDetailForm();
            refreshBarberDetailTable();
        }
    } catch (err) {
        console.error(err);
    }
});

// 4. Hapus (DELETE)
async function hapusBarberDetail(id) {
    if (confirm('Hapus data ini?')) {
        try {
        const res = await fetch(`${KAPS_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) refreshBarberDetailTable();
        } catch (err) {
            console.error("Gagal hapus data:", err);
        }
    }
}

// Inisialisasi awal
refreshBarberDetailTable();
//#endregion ===== END BARBERS/KAPSTER

//#region ===== JADWAL =====
const BASE_URL = 'http://localhost:4000/api/jadwal';
let isEditMode = false;
let idUp = null; // Pastikan variabel idUp terdefinisi
const search = document.getElementById('search');

// 1. Fungsi untuk memindahkan data tabel ke form (Mode Edit)
function persiapkanEdit(id, hari, buka, tutup, isTutup) {
    isEditMode = true;
    idUp = id;

    document.getElementById('hariInput').value = hari;
    document.getElementById('bukaInput').value = (buka === 'null' || !buka) ? '' : buka;
    document.getElementById('tutupInput').value = (tutup === 'null' || !tutup) ? '' : tutup;
    document.getElementById('isTutupInput').value = isTutup;

    // UI Feedback menggunakan Bootstrap Classes
    const btnSave = document.querySelector('.btn-save');
    btnSave.innerText = "Update Data Jadwal";
    btnSave.classList.replace('btn-primary', 'btn-warning'); // Ubah warna ke oranye (warning)
    btnSave.classList.add('text-white');

    // TAMPILKAN tombol batal
    document.getElementById('btnBatal').style.display = "block";

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Ambil Semua Data
async function refreshTable(query = '') {
    try {
        const url = query ? `${BASE_URL}?q=${encodeURIComponent(query)}` : BASE_URL;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Gagal mengambil data');

        const data = await response.json();
        const tbody = document.querySelector('#jadwalTable tbody');
        tbody.innerHTML = '';

        data.forEach(item => {
            const tr = document.createElement('tr');

            // Logika Warna Badge Bootstrap
            const badgeClass = item.Is_tutup ? 'bg-danger' : 'bg-success';
            const statusText = item.Is_tutup ? 'TUTUP' : 'BUKA';
            const jamOperasional = item.Is_tutup ? '<span class="text-muted">-</span>' : `${item.Jam_buka} - ${item.Jam_tutup}`;

            tr.innerHTML = `
            <td><span class="fw-bold text-dark">${item.Hari}</span></td>
            <td>${jamOperasional}</td>
            <td>
                <span class="badge ${badgeClass}">${statusText}</span>
            </td>
            <td class="text-center">
                <div class="btn-group" role="group">
                    <button onclick="persiapkanEdit('${item.Jadwal_id}', '${item.Hari}', '${item.Jam_buka}', '${item.Jam_tutup}', ${item.Is_tutup})" 
                            class="btn btn-sm btn-info text-white">
                        Edit
                    </button>
                    <button onclick="hapusData('${item.Jadwal_id}', '${item.Hari}')" 
                            class="btn btn-sm btn-danger">
                        Hapus
                    </button>
                </div>
            </td>`;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Gagal ambil data:", err);
    }
}

// 3. Search Listener
search.addEventListener('input', (e) => {
    refreshTable(e.target.value);
});

// 4. Submit Form (Create & Update)
document.getElementById('jadwalForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        hari: document.getElementById('hariInput').value,
        jam_buka: document.getElementById('bukaInput').value || null,
        jam_tutup: document.getElementById('tutupInput').value || null,
        is_tutup: parseInt(document.getElementById('isTutupInput').value)
    };

    const url = isEditMode ? `${BASE_URL}/${idUp}` : BASE_URL;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(isEditMode ? '🎉 Data berhasil diupdate!' : '🚀 Data berhasil disimpan!');
            resetForm();
            refreshTable();
        } else {
            const errData = await response.json();
            alert('Gagal: ' + (errData.pesan || 'Terjadi kesalahan'));
        }
    } catch (err) {
        console.error("Gagal proses data:", err);
        alert('Terjadi kesalahan koneksi ke server.');
    }
});

// 5. Fungsi Hapus
async function hapusData(id, hari) {
    if (!confirm(`Apakah Anda yakin ingin menghapus jadwal hari ${hari}?`)) return;

    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            refreshTable();
        } else {
            alert('Gagal menghapus data.');
        }
    } catch (err) {
        console.error("Gagal hapus:", err);
    }
}

// 6. Reset Form & UI State
function resetForm() {
    isEditMode = false;
    idUp = null;

    document.getElementById('jadwalForm').reset();

    const btnSave = document.querySelector('.btn-save');
    btnSave.innerText = "Simpan ke Database";

    // Kembalikan ke warna asli Bootstrap (Primary)
    btnSave.className = "btn btn-primary btn-save w-100 py-2 fw-bold";

    document.getElementById('btnBatal').style.display = "none";
}

// Inisialisasi awal
refreshTable();
//#endregion ===== END JADWAL =====

//#region ===== SERVICES =====
const SERVICE_URL = 'http://localhost:4000/api/serv';
let isEditService = false;
let serviceIdUp = null;
const searchs = document.getElementById('searchs');

// Tampil/Sembunyi Form
function showServiceForm() {
    isEditService = false;
    serviceIdUp = null;
    document.getElementById('serviceForm').reset();
    document.getElementById('submitService').innerText = 'Simpan Layanan';
    document.getElementById('serviceFormContainer').style.display = 'block';
    // Isi dropdown cabang saat form dibuka
    isiDropdownCabang('serviceBarbershopId');
}

function hideServiceForm() {
    document.getElementById('serviceFormContainer').style.display = 'none';
}

// 1. Ambil Data (READ)
async function refreshServiceTable(query = '') {
    try {
        const url = query ? `${SERVICE_URL}?q=${encodeURIComponent(query)}` : SERVICE_URL;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Gagal mengambil data');

        const data = await response.json();
        const tbody = document.querySelector('#serviceTable tbody');
        tbody.innerHTML = '';

        data.forEach(item => {
            const formattedHarga = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(item.Harga);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="fw-bold">${item.Layanan}</span></td>
                <td><span class="badge bg-secondary">${item.Barbershop || 'Cabang '+item.Barbershop_id}</span></td>
                <td class="text-success fw-bold">${formattedHarga}</td>
                <td>${item.Estimasi} Menit</td>
                <td class="text-center">
                    <div class="btn-group">
                        <button onclick="editService('${item.Services_id}', '${item.Barbershop_id}', '${item.Layanan}', '${item.Harga}', '${item.Estimasi}')" 
                                class="btn btn-sm btn-outline-info">Edit</button>
                        <button onclick="hapusService('${item.Services_id}')" 
                                class="btn btn-sm btn-outline-danger">Hapus</button>
                    </div>
                </td>`;
            tbody.appendChild(tr);
        });
    } catch (err) { console.error("Gagal load services:", err); }
}

searchs.addEventListener('input', (e) => {
    refreshServiceTable(e.target.value);
});

// 2. Simpan & Update (CREATE & UPDATE)
document.getElementById('serviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        Bar: document.getElementById('serviceBarbershopId').value,
        Serv: document.getElementById('namaJasa').value,
        Harga: parseFloat(document.getElementById('hargaJasa').value),
        Dur: parseInt(document.getElementById('estimasiJasa').value)
    };

    const method = isEditService ? 'PUT' : 'POST';
    const url = isEditService ? `${SERVICE_URL}/${serviceIdUp}` : SERVICE_URL;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert(isEditService ? 'Layanan diperbarui!' : 'Layanan ditambahkan!');
            hideServiceForm();
            refreshServiceTable();
        }
    } catch (err) { console.error("Gagal simpan service:", err); }
});

// 3. Persiapan Edit
async function editService(id, barberId, nama, harga, estimasi) {
    showServiceForm();
    isEditService = true;
    serviceIdUp = id;

    // Tunggu dropdown terisi lalu pilih id yang sesuai
    await isiDropdownCabang('serviceBarbershopId', barberId);

    document.getElementById('namaJasa').value = nama;
    document.getElementById('hargaJasa').value = harga;
    document.getElementById('estimasiJasa').value = estimasi;
    document.getElementById('submitService').innerText = 'Update Layanan';

    window.scrollTo({ top: document.getElementById('serviceFormContainer').offsetTop - 100, behavior: 'smooth' });
}

// 4. Hapus (DELETE)
async function hapusService(id) {
    if (confirm('Hapus layanan ini secara permanen?')) {
        try {
            const res = await fetch(`${SERVICE_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) refreshServiceTable();
        } catch (err) { console.error("Gagal hapus service:", err); }
    }
}

// Inisialisasi
refreshServiceTable();
//#endregion ===== END SERVICES =====

//#region ===== BOOKINGS =====
// 1. Load Layanan saat halaman siap
async function loadServicesToBooking() {
    try {
        const res = await fetch(SERVICE_URL);
        const data = await res.json();
        const select = document.getElementById('bookService');
        data.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.Services_id;

            const hargaFormatted = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(s.Harga);

            opt.textContent = `${s.Layanan} - ${hargaFormatted}`;
            opt.dataset.price = s.Harga;
            select.appendChild(opt);
        });
    } catch (e) { console.error("Gagal load layanan booking", e); }
}

// 2. Event: Ketika Layanan dipilih, Munculkan Kapster
document.getElementById('bookService').addEventListener('change', async (e) => {
    const serviceId = e.target.value;
    const kapsContainer = document.getElementById('kapsterSection');
    const selectKaps = document.getElementById('bookBarber');

    if (serviceId) {
        // Ambil data kapster (Barbers)
        const res = await fetch(KAPS_URL);
        const allKaps = await res.json();

        // Filter kapster yang statusnya 'Aktif'
        selectKaps.innerHTML = '<option value="">-- Pilih Kapster Tersedia --</option>';
        allKaps.filter(k => k.Status === 'Aktif').forEach(k => {
            const opt = document.createElement('option');
            opt.value = k.Barbers_id;
            opt.textContent = k.Kapster;
            selectKaps.appendChild(opt);
        });

        kapsContainer.style.display = 'block';
    } else {
        kapsContainer.style.display = 'none';
        document.getElementById('waktuSection').style.display = 'none';
    }
});

// 3. Event: Ketika Kapster dipilih, Munculkan Waktu & Tombol
document.getElementById('bookBarber').addEventListener('change', (e) => {
    const waktuContainer = document.getElementById('waktuSection');
    const btnSubmit = document.getElementById('btnKonfirmasi');

    if (e.target.value) {
        waktuContainer.style.display = 'block';
        btnSubmit.style.display = 'block';
    } else {
        waktuContainer.style.display = 'none';
        btnSubmit.style.display = 'none';
    }
});

let tempPayload = {}; // Variabel penampung data sementara
const myModal = new bootstrap.Modal(document.getElementById('modalPayment'));

// 4. Tahap Pertama: Menampilkan Rincian (Buka Modal)
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const serviceEl = document.getElementById('bookService');
    const selectedService = serviceEl.options[serviceEl.selectedIndex];
    const barberEl = document.getElementById('bookBarber');
    const selectedBarber = barberEl.options[barberEl.selectedIndex];

    // Simpan data ke variabel sementara
    tempPayload = {
        Users_id: 1, // Simulasi
        Barbers_id: barberEl.value,
        Services_id: serviceEl.value,
        Start_time: `${document.getElementById('bookDate').value} ${document.getElementById('bookTime').value}:00`,
        Total_harga: selectedService.getAttribute('data-price')
    };

    // Tampilkan rincian di dalam Modal
    document.getElementById('summaryContent').innerHTML = `
        <div class="d-flex justify-content-between"><span>Layanan:</span> <strong>${selectedService.textContent}</strong></div>
        <div class="d-flex justify-content-between"><span>Kapster:</span> <strong>${selectedBarber.textContent}</strong></div>
        <div class="d-flex justify-content-between"><span>Jadwal:</span> <strong>${tempPayload.Start_time}</strong></div>
        <div class="d-flex justify-content-between mt-2 pt-2 border-top"><span>Total Bayar:</span> <strong class="text-primary h5">Rp${parseFloat(tempPayload.Total_harga).toLocaleString()}</strong></div>
    `;

    myModal.show(); // Munculkan Modal rincian
});

// 5. Tahap Kedua: Kirim Data & File ke Backend
document.getElementById('btnFinalSubmit').addEventListener('click', async () => {
    const fileInput = document.getElementById('buktiBayarFile');

    if (fileInput.files.length === 0) {
        return alert("Silakan pilih file bukti pembayaran terlebih dahulu!");
    }

    const btn = document.getElementById('btnFinalSubmit');
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Mengirim...`;

    // Gunakan FormData karena mengirim File
    const formData = new FormData();
    formData.append('Users_id', tempPayload.Users_id);
    formData.append('Barbers_id', tempPayload.Barbers_id);
    formData.append('Services_id', tempPayload.Services_id);
    formData.append('Start_time', tempPayload.Start_time);
    formData.append('Total_harga', tempPayload.Total_harga);
    formData.append('bukti', fileInput.files[0]); // Ini file gambarnya

    try {
        const res = await fetch('http://localhost:4000/api/book', {
            method: 'POST',
            body: formData // Jangan set Header Content-Type jika pakai FormData
        });

        if (res.ok) {
            alert('✅ Booking & Bukti Bayar Berhasil Dikirim!');
            myModal.hide();
            resetBookingForm();
            document.getElementById('buktiBayarFile').value = ''; // Reset file input
            refreshBookingTable();
        } else {
            const err = await res.json();
            alert('❌ Gagal: ' + err.pesan);
        }
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan koneksi.');
    } finally {
        btn.disabled = false;
        btn.innerText = 'KIRIM BOOKING';
    }
});

// 5. Refresh Tabel Booking
async function refreshBookingTable() {
    try {
        const res = await fetch('http://localhost:4000/api/book');
        const data = await res.json();
        const tbody = document.querySelector('#bookingTable tbody');
        tbody.innerHTML = '';

        data.forEach(b => {
            const statusBayarClass = b.Status_bayar === 'Sudah Bayar' ? 'bg-success' : 'bg-warning text-dark';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><small class="fw-bold">#${b.Bookings_id}</small></td>
                <td>${b.Customer}</td>
                <td>${b.Layanan} <br> <small class="text-muted">Kapster: ${b.Kapster}</small></td>
                <td>${new Date(b.Waktu_mulai).toLocaleString('id-ID')}</td>
                <td class="fw-bold">Rp${parseFloat(b.Harga).toLocaleString()}</td>
                <td><span class="badge ${statusBayarClass}">${b.Status_bayar}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary" onclick="konfirmasiBayar(${b.Bookings_id})">Validasi</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Gagal memuat tabel booking:", error);
    }
}

// 6. Reset Form & UI
function resetBookingForm() {
    document.getElementById('bookingForm').reset();
    document.getElementById('kapsterSection').style.display = 'none';
    document.getElementById('waktuSection').style.display = 'none';
    document.getElementById('btnKonfirmasi').style.display = 'none';
}

loadServicesToBooking();
refreshBookingTable();
//#endregion ===== END BOOKINGS =====