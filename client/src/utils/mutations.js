import { gql } from '@apollo/client';

const USER_CREATION = gql`
mutation RegisterUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

const USER_LOGIN = gql`
mutation loginUser($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`;

const BOOK_SAVE = gql`
mutation AddBook($body: BookInput!) {
  saveBook(body: $body) {
    _id
    username
    savedBooks {
      authors
      bookId
      description
      image
      link
      title
    }
  }
}
`;

const BOOK_DELETE = gql`
mutation RemoveBook($bookId: String!) {
  deleteBook(bookId: $bookId) {
    _id
    savedBooks {
      authors
      bookId
      description
      image
      link
      title
    }
  }
}
`;

export { USER_CREATION, USER_LOGIN, BOOK_SAVE, BOOK_DELETE };
