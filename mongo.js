// mongodb+srv://user:<password>@cluster0.izki6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const mongoose = require('mongoose')

const main = async () => {
  if (process.argv.length < 3) {
    console.log(
      'Please provide the password as an argument: node mongo.js <password>'
    )
    process.exit(1)
  }

  const password = process.argv[2]

  const url = `mongodb+srv://user:${password}@cluster0.izki6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })

  const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length === 5) {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })
    await person.save()
    console.log(`added ${person.name} number ${person.number} to phonebook`)
  } else {
    const people = await Person.find({})
    console.log('phonebook:')
    people.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
  }

  mongoose.connection.close()
}
main()
