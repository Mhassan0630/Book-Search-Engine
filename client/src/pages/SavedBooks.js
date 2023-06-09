import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import { DESTROY_BOOK } from '../utils/mutations';
import { FETCH_USER } from '../utils/queries'
import { useMutation, useQuery } from '@apollo/client';

import Auth from '../utils/auth';
import { discardBookId } from '../utils/localStorage';

const Bookmarks = () => {
  const { loading, response } = useQuery(FETCH_USER)
  const userProfile = response?.me || []
  console.log(userProfile);

  const  [deleteBook]  = useMutation(DESTROY_BOOK, {
    update(cache, { data: { deleteBook }}) {
      try {
        cache.writeQuery({
          query: FETCH_USER,
          data: { me: deleteBook }
        })
      } catch (e) {
        console.error(e);
    }
  }
  })

  const handleBookRemoval = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await deleteBook({
        variables: { bookId }
      });
      console.log(userProfile);
      discardBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Inspecting saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userProfile.savedBooks?.length
            ? `Inspecting ${userProfile.savedBooks.length} saved ${userProfile.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'No books saved!'}
        </h2>
        <Row>
          {userProfile.savedBooks?.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`Cover of ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleBookRemoval(book.bookId)}>
                      Remove this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default Bookmarks;
