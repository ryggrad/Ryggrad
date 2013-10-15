describe "Model Relations", ->
  Album = undefined
  Photo = undefined
  
  beforeEach ->
    class Album extends Ryggrad.Model 
      @configure("Album", "name")

    class Photo extends Ryggrad.Model 
      @configure("Photo", "name")

  it "should honour hasMany associations", ->
    Album.hasMany "photos", Photo
    Photo.belongsTo "album", Album
    album = Album.create()
    album.photos().should.be.truthy
    album.photos().create name: "First Photo"
    album.photos().all()[0].name.should.equal "First Photo"
    Photo.first().should.be.truthy
    Photo.first().name.should.be "First Photo"
    Photo.first().album_id.should.be album.id

  it "should honour belongsTo associations", ->
    Album.hasMany "photos", Photo
    Photo.belongsTo "album", Album
    Photo.attributes.should.be ["name", "album_id"]
    album = Album.create(name: "First Album")
    photo = Photo.create(album: album)
    photo2 = Photo.create({})
    photo.album().should.be.truthy
    photo2.album().should.be.false
    photo.album().name.should.be "First Album"

  it "can count Collection records", ->
    Album.hasMany "photos", Photo
    Photo.belongsTo "album", Album
    album = Album.create(
      name: "Beautiful album"
      photos: [
        id: "1"
        name: "Beautiful photo 1"
      ,
        id: "2"
        name: "Beautiful photo 2"
      ]
      id: "1"
    )
    album.photos().count().should.equal 2

  it "should associate an existing Singleton record", ->
    Album.hasOne "photo", Photo
    Photo.belongsTo "album", Album
    album = Album.create(
      id: "1"
      name: "Beautiful album"
    )
    photo = Photo.create(
      id: "2"
      name: "Beautiful photo"
    )
    album.photo photo
    album.photo().should.be.truthy
    album.photo().album_id.should.be "1"
    album.photo().name.should.be "Beautiful photo"

  it "should create a new related Singleton record", ->
    Album.hasOne "photo", Photo
    Photo.belongsTo "album", Album
    album = Album.create(
      name: "Beautiful album"
      photo:
        name: "Beautiful photo"

      id: "1"
    )
    album.photo().should.be.truthy
    album.photo().album_id.should.be "1"
    album.photo().name.should.be "Beautiful photo"

  it "should associate existing records into a Collection", ->
    Album.hasMany "photos", Photo
    Photo.belongsTo "album", Album
    album = Album.create(
      name: "Beautiful album"
      id: "1"
    )
    photo1 = Photo.create(
      id: "1"
      name: "Beautiful photo 1"
    )
    photo2 = Photo.create(
      id: "2"
      name: "Beautiful photo 2"
    )
    album.photos [photo1, photo2]
    Photo.count().should.be 2
    album.photos().count().should.be 2
    album.photos().first().album_id.should.be "1"
    album.photos().last().album_id.should.be "1"
    album.photos().first().name.should.be "Beautiful photo 1"
    album.photos().last().name.should.be "Beautiful photo 2"

  it "can refresh Collection records without effecting unrelated model records", ->
    Album.hasMany "photos", Photo
    Photo.belongsTo "album", Album
    album = Album.create(
      name: "Beautiful album"
      photos: [
        id: "1"
        name: "This record should be removed"
      ]
      id: "2"
    )
    Photo.create
      id: "3"
      name: "This record should NOT be removed"

    Photo.count().should.be 2
    album.photos().count().should.be 1
    album.photos().first().id.should.be "1"
    photo1 =
      id: "4"
      name: "Beautiful photo 1"

    photo2 =
      id: "5"
      name: "Beautiful photo 2"

    album.photos [photo1, photo2]
    Photo.count().should.be 3
    Photo.first().id.should.be "3"
    Photo.first().name.should.be "This record should NOT be removed"
    album.photos().count().should.be 2
    album.photos().first().album_id.should.be "2"
    album.photos().last().album_id.should.be "2"
    album.photos().first().name.should.be "Beautiful photo 1"
    album.photos().last().name.should.be "Beautiful photo 2"

  it "can add unassociated records to an existing Collection", ->
    Album.hasMany "photos", Photo
    Photo.belongsTo "album", Album
    album = Album.create(
      photos: [
        id: "1"
        name: "Beautiful photo 1"
      ]
      name: "Beautiful album"
      id: "1"
    )
    photo2 = Photo.create(
      id: "2"
      name: "Beautiful photo 2"
    )

    album.photos().all().length.should.be 1
    album.photos().add photo2
    album.photos().all().length.should.be 2
    album.photos().first().album_id.should.be "1"
    album.photos().last().album_id.should.be "1"
    album.photos().first().name.should.be "Beautiful photo 1"
    album.photos().last().name.should.be "Beautiful photo 2"

  it "can remove records from a Collection", ->
    Album.hasMany "photos", Photo
    Photo.belongsTo "album", Album
    album = Album.create(
      photos: [
        id: "1"
        name: "Beautiful photo 1"
      ]
      name: "Beautiful album"
      id: "1"
    )
    photo2 = Photo.create(
      id: "2"
      name: "Beautiful photo 2"
    )
    album.photos().add photo2
    album.photos().should.be.truth
    album.photos().all().length.should.be 2
    album.photos().last().name.should.be "Beautiful photo 2"
    album.photos().remove photo2
    album.photos().all().length.should.be 1
    album.photos().last().name.should.be "Beautiful photo 1"

  it "can create new related Collection records", ->
    Album.hasMany "photos", Photo
    Photo.belongsTo "album", Album
    album = Album.create(
      name: "Beautiful album"
      photos: [
        id: "1"
        name: "Beautiful photo 1"
      ,
        id: "2"
        name: "Beautiful photo 2"
      ]
      id: "1"
    )
    album.photos().should.be.truthy
    album.photos().all().length.should.be 2
    album.photos().first().album_id.should.be "1"
    album.photos().last().album_id.should.be "1"
    album.photos().first().name.should.be "Beautiful photo 1"
    album.photos().last().name.should.be "Beautiful photo 2"
