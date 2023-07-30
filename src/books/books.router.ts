import express, { Response, Request } from "express";
import { body, validationResult } from "express-validator";
import { MongoServerError } from "mongodb";
import { create, update } from "./books.service";
export const router = express.Router();

const validationBook = [
  body("isbn").notEmpty().exists().isISBN(),
  body("name").notEmpty().exists(),
  body("author").notEmpty().exists(),
  body("pages").notEmpty().exists().isInt({ min: 10 }),
];

type RequestPost = Request<
  { id: string },
  unknown,
  { isbn: string; name: string; author: string; pages: number }
>;

router.post("/", validationBook, async (req: RequestPost, res: Response) => {
  const validationRes = validationResult(req);
  if (!validationRes.isEmpty()) {
    return res.status(400).json({ error: validationRes.array() });
  }

  try {
    const result = await create(req.body.isbn, req.body.name, req.body.author, req.body.pages);
    return res.status(201).json(result);
  } catch (error: unknown) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return res.status(409).json({ error });
    }
  }
});

type RequestPut = Request<{id: string}, unknown, {isbn: string; name: string; author: string; pages: number}>;

router.put("/:id", validationBook, (req: RequestPut, res: Response) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json({ error: validation.array() });
  }

  const {isbn, name, author, pages} = req.body;

  const book = update(isbn, name, author, pages);
  if (!book) {
    return res.status(404).json({ error: "book not found" });
  }

  res.status(200).json(book);
});
















// app.get('/books', async (req: Request, res: Response) => {
//   try {
//     const books = await collection.find().toArray();
//     res.json(books);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.get('/books/:id', async (req: Request, res: Response) => {
//   try {
//     const bookId = getById(req.params.id);
//     const book = await collection.findOne({ _id: bookId });

//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     res.json(book);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });