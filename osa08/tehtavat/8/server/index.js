require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const start = require("./db/mongo");
const Book = require("./db/models/book");
const Author = require("./db/models/author");
const User = require("./db/models/user");

const MONGODB_URI = process.env.MONGODB_URI;

const typeDefs = `
  type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(author: String, genre: String): [Book]!
		allAuthors: [Author]!
		me: User
  }

	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}

	type Token {
		value: String!
	}

	type Book {
		title: String!
		published: Int!
		author: Author!
		genres: [String!]!
		id: ID!
	}

	type Author {
		name: String!
		born: Int
		bookCount: Int!
		id: ID!
	}

	type Mutation {
		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String!]!
		): Book!

		editAuthor(
			name: String!
			setBornTo: Int!
		): Author

		createUser(
			username: String!
			favoriteGenre: String!
		): User

		login(
			username: String!
			password: String!
		): Token
	}

`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author });

        if (!author) {
          return [];
        } else {
          return Book.find({ author: author._id }).populate("author");
        }
      } else if (args.genre) {
        const genre = await Book.find({
          genres: args.genre,
        }).populate("author");

        console.log("genre", genre);

        if (genre) {
          return genre;
        } else {
          return [];
        }
      } else {
        return Book.find({}).populate("author");
      }
    },
    allAuthors: async () => {
      const authors = await Author.find({});

      const promises = authors.map(async (aut) => {
        const bookCount = await Book.countDocuments({ author: aut._id });

        return { ...aut.toObject(), bookCount };
      });

      return Promise.all(promises);
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        try {
          author = new Author({ name: args.author });
          await author.save();
        } catch (error) {
          throw new GraphQLError(
            "Too short author name (must be at least 5 chars)",
            {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args.author,
                error,
              },
            }
          );
        }
      }

      const book = new Book({ ...args, author: author._id });

      try {
        await book.save();
        await book.populate("author");

        return book;
      } catch (error) {
        throw new GraphQLError(
          "Too short book name (must be at least 4 chars)",
          {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title,
              error,
            },
          }
        );
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const author = await Author.findOne({ name: args.name });
      if (author) {
        const updated = await Author.findOneAndUpdate(
          { name: args.name },
          { $set: { born: args.setBornTo } },
          { new: true }
        );

        return updated;
      }

      return null;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        favoriteGenre: user.favoriteGenre,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

start(MONGODB_URI);

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;

    // console.log("auth", auth);

    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );

      console.log("decaoded", decodedToken);

      const currentUser = await User.findById(decodedToken.id);

      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
