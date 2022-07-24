# Test Case Junior Back-End Developer
### Informasi Program
- Menggunakan Bahasa Pemogramana Javasript
- Menggunakan Versi [NodeJS v16.13.0](https://nodejs.org/en/download/)
- Menggunakan database Mysql

### Instalasi
gunakan perintah berikut untuk mendownload repository serta menginstall library
```
git clone https://github.com/onekill0503/Test-Case-Junior-Back-End-Developer.git && cd Test-Case-Junior-Back-End-Developer && npm install
```

### Import Data
ada 2 cara mengimport database yang sudah ada atau melakukan migration dengan library sequelize.
- Cara pertama
bisa dilakukan dengan mengimport file sql yang ada pada folder `database_file`
- Cara Kedua
gunakan perintah berikut untuk melakukan migration
```
npx sequelize-cli db:migrate
```

### Running Server
Masuk ke root directory lalu masukan perintah berikut untuk menjalankan server
```
npm start
```

### Unit Testing
untuk melakukan test fungsional bisa jalankan perintah berikut
```
npm test
```

agar tidak terjadi error tambahkan setidaknya 1 records di tabel category secara manual agar testing fungsional product tidak gagal.

## API

### Add Category `/categories PUT`
Key | Deskripsi | Note | Tipe Data
--- | --- | --- | ---
`category_name` | nama kategori yang akan ditambahkan | required | `string`

### Get Category `/categories GET`
Key | Deskripsi | Note | Tipe Data
--- | --- | --- | ---
`sorted` | jika berstatus `true` maka akan menampilkan data dan diurutkan dari jumlah product terbanyak ke sedikit. | optional | `boolean`

### Delete Category `/categories DELETE`
Key | Deskripsi | Note | Tipe Data
--- | --- | --- | ---
`categories_id` | berisikan id dari kategori yang ada pada database, jika ingin menghapus lebih dari 1 kategori bisa dipisang menggunakan , . contoh : `1,5,2` | required | `string`

### Add Products `/products PUT`
Key | Deskripsi | Note | Tipe Data
--- | --- | --- | ---
`category` | id kategori | required | `string`
`name` | nama produk | required | `string`
`price` | harga produk | required | `integer`
`images` | gambar/asset produk yang diupload (bisa lebih dari 1 gambar) | optional | `file`

### Get Products `/products GET`
Key | Deskripsi | Note | Tipe Data
--- | --- | --- | ---
`sorted` | jika berstatus `true` maka akan menampilkan data dan diurutan dari harga termahal ke termurah. | optional | `boolean`

### Delete Products `/products DELETE`
Key | Deskripsi | Note | Tipe Data
--- | --- | --- | ---
`product_id` | berisikan id dari produk yang ada pada database, jika ingin menghapus lebih dari 1 kategori bisa dipisang menggunakan , . contoh : `1,5,2` | required | `string`

### Edit Products `/edit_product PUT`
Key | Deskripsi | Note | Tipe Data
--- | --- | --- | ---
`product_id` | id produk yang diedit / diubah | required | `string`
`category` | id kategori | required | `string`
`name` | nama produk | required | `string`
`price` | harga produk | required | `integer`
`images` | gambar/asset produk yang diupload (bisa lebih dari 1 gambar) | optional | `file`
`deleted_asset` | id asset produk yang ingin dihapus , jika ingin menghapus lebih dari 1 asset produk bisa dipisang menggunakan , . contoh : `1,5,2` | optional | `string`

### Add Products Assets `/assets PUT`
Key | Deskripsi | Note | Tipe Data
--- | --- | --- | ---
`product_id` | id produk yang | required | `string`
`images` | gambar/asset produk yang diupload (bisa lebih dari 1 gambar) | required | `file`

### Delete Products Assets `/assets DELETE`
Key | Deskripsi | Note | Tipe Data
--- | --- | --- | ---
`asset_id` | berisikan id dari asset produk yang ada pada database, jika ingin menghapus lebih dari 1 asset produk bisa dipisang menggunakan , . contoh : `1,5,2` | required | `string`