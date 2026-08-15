import {
  getBook,
  getBooks,
} from "./registry/book-registry.js";

console.log("ALL BOOKS:");

console.log(
  JSON.stringify(
    getBooks(),
    null,
    2
  )
);

console.log("\nSINGLE BOOK:");

console.log(
  JSON.stringify(
    getBook("the-eye-of-the-world"),
    null,
    2
  )
);