const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    hashedPassword: {
        type: String,
        required: [true, 'Hashed Password is required']
    },
    bio: {
        type: String,
        default: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. ",
        required: false
    },
    displayImage: {
        data: Buffer,
        type: String,
        default: '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAFBQUFBVUFpkZFp9h3iHfbmqm5uquf/I18jXyP//////////////////////////////////////////////////2wBDAVBQUFBVUFpkZFp9h3iHfbmqm5uquf/I18jXyP//////////////////////////////////////////////////wAARCAErASsDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAECAwT/xAAcEAEBAQEBAQEBAQAAAAAAAAAAARECEhMhAzH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AOUYs8QZ4uRUjTATIsYATTAwDLzDME+YXiKPQZ/NPhsmgz8D5tIsHP8ANF4sdY/AcfmlldmQvMByDHV4g8QHKHT84XzFc4b+IXzBgHROD+UUcxOr5lf4iOcm3yL50GRnebCAAAAAAbyKkBxA8MECiIwAMgBaCA9CQCywCgNVrDqpndUdOkmXTAwQ1BWgiBWloAAEYAwSh6V6Z3pFoLva+awacg2yVPz5Bgzv8oXzagGPyP5NgCACQGmUMAAALT1JgYAAgRgoqBQYdJV2Sglxtz1rES4DcFLpgYLQCgnS0DEqdMFotBAkjIA0iI15AzPCAHhHoERgEEYQMEYEZEBWnKVggLhpME0KpQDMyBj2hp2yUMqekB89Y03WJy4DY2fo9BRDSAziQCyLQBEKQKjWM40gLIAAAQGCAJBGgWnCw4BlplgEAAEMpDBOriMVAWQTaCe2DXqsqoCAAGRgAAC5TQYKBADAIAAAXFojQAqFAgZGkDIaegikZAeqiFSgoi0AARAenqACyNNA9TRpAmorSs6oQAAAAAYMCMADNJwDBkAAMFctIyjSAsEKgAkwBKGAkEYJB0gAOHgJMgAODDAysPRoMrKTSs6CbSBKAjAEDAAHgsABJgauYhrwC/KLMdUjPvkGAF2Ll3/QTGkLDgGnVlkQKGMMCGipAyIAKRjACtSWgo0aegsiAAqaOqBWgotRnUrqAAAAGQBpDRKqUE9cpbJvIIjbhljbiA6YjtfI6gOW5SkxXUSCjTFwADTqCgWmBFh4AQNFQo00tZgGpYiVeoJxUh6AOFRpWgVqL+i0ooqLKGCayraosBmYAAAADhHAaRWJjWAjyufik0G3NaObmt4DPvlz122ax64BlItU5OwGVpFRAVIuCGBEKQITYupQThY0wYDPFCkCodpAAKSbQKnEL5UaGAgRUwDKxONixRkcV5PALFYeGAkWkwUVmlpygU/G/LNfINiwjAYjponoHH1/pyjufqAbabOVoBVOip0DJKb0g09YPUYbS1R0XEstp7QaRbD0qdguxnWmys+gSvlmvkGwI0CBkAIwBGAoDBgBipFSAyxUjXyryCJyucqxQFIZgAmqTQcvbJt2jAEWmLBPTFvUeAZJpkCSUQAAgMAAYIAF8oVAbQ0xSAIwABgCGKNRK5CXAOReEYGZGAMGAAAAqZUHL2iNP6MgUJUbTlQaGIoHLYjK2P8AFGBNbIWAyJpYnASDwAAABqiV8g0hkEDMjUBgwGGZgSoJFYAMzAGAAMAAAAAABh/SOau3pydAkAwac1esJ+L0CxnZY2FgMQq8pAiUASVigDPCVSANIzawFAAAZGCjSYKUgwXFs4sFGlQGZGAAAAAAAQBPTk7/ANddcvYJisRGsBOBacBE7P2yANfUpM9GgsYj0foDA0aBVm0qAEaRnFwFgjAAADNIBZoVAXFoigUpJgoyAGCAGCMAAQFXN3HVWHYMFxJwGgIgcxkAMgAAAAzIACAA1RKoCgABggAMgBnKkwaSrlYq0G0qmMrSUFmkwMgAMAAAABVh22rDsGRkAaSmhYOUAAAAAAAGQAAEYHFoi4BgAAAAAAAAGAMgC40jFcoNjRKsDAAAyAGAATWHTesegYhVSBqZqBiCAGCAGAABAAAABriDgNARgAAAAAAwAAAA1RKoDSLjOLgKBADMgCjSoE2Meo3rLsGFQdqQMyMGIAAAADAAAjIAAACok4CzSYGZGAAMAAYAGABgwVFRJgsJMDAAKhlDAqw/pW9c39AYmRgZnDB//9k=',
        required: false
    },
    posts: {
        type: [String],
        default: []
    },
    followers: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: []
    },
    likes: {
        type: [String],
        default: []
    },
    collections: {
        type: [Object],
        default: []
    },

})

module.exports = userSchema