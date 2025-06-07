import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "./Fireconfig";
import { ref, push, onValue } from "firebase/database";
import './Post.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "", tags: "" });

  useEffect(() => {
    const postsRef = ref(db, "posts");
    onValue(postsRef, (snapshot) => {
      const firebaseData = snapshot.val();
      let firebasePosts = [];
      if (firebaseData) {
        firebasePosts = Object.entries(firebaseData).map(([key, post]) => ({
          firebaseKey: key,
          id: post.id,
          ...post,
        }));
      }

      axios
        .get("https://dummyjson.com/posts")
        .then((response) => {
          const apiPosts = response.data.posts.map((post) => ({
            ...post,
            id: "api-" + post.id, 
          }));

          const combinedPosts = [...firebasePosts, ...apiPosts];
          setPosts(combinedPosts);
        })
        .catch((error) => {
          console.error("Error fetching API posts:", error);
          setPosts(firebasePosts);
        });
    });
  }, []);

  const handlePostSubmit = (e) => {
    e.preventDefault();

    const postToAdd = {
      ...newPost,
      id: posts.length + 1, 
      views: 0,
      userId: 999,
      tags: newPost.tags.split(",").map((tag) => tag.trim()),
    };

    const postsRef = ref(db, "posts");
    push(postsRef, postToAdd)
      .then(() => {
        setNewPost({ title: "", body: "", tags: "" });
        setShowAddForm(false);
      })
      .catch((error) => {
        console.error("Error adding post to Firebase:", error);
      });
  };

  const handleAddToCart = (post) => {
    setCartItems((prev) => [...prev, post]);
    setShowCart(true);
  };

  return (
    <Container className="mt-4 position-relative">
       {/* Add Post Sidebar */}
      <div className={`sidebar-form ${showAddForm ? "show" : ""}`}>
        <h4>Add New Post</h4>
        <Form onSubmit={handlePostSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBody">
            <Form.Label>Body</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTags">
            <Form.Label>Tags (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              value={newPost.tags}
              onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" className="mt-3">
            Submit Post
          </Button>
          <Button variant="secondary" className="mt-3 ms-2" onClick={() => setShowAddForm(false)}>
            Cancel
          </Button>
        </Form>
      </div>

     {/* Cart Sidebar */}
<div className={`cart-sidebar ${showCart ? "show" : ""}`}>
  <h4>Cart Items</h4>
  
  {cartItems.length === 0 ? (
    <p>No posts in cart.</p>
  ) : (
    cartItems.map((item, index) => (
      <Card key={index} className="mb-3 position-relative">
        <Button 
          variant="danger" 
          size="sm" 
          className="remove-btn"
          onClick={() =>
            setCartItems((prev) => prev.filter((_, i) => i !== index))
          }
        >
          &times;
        </Button>
        <Card.Body>
          <Card.Title>{item.title}</Card.Title>
          <Card.Text>{item.body.slice(0, 60)}...</Card.Text>
        </Card.Body>
      </Card>
    ))
  )}

  <div className="d-flex gap-2 mt-3">
    <Button variant="danger" onClick={() => setCartItems([])}>
      Clear Cart
    </Button>
    <Button variant="secondary" onClick={() => setShowCart(false)}>
      Cancel
    </Button>
  </div>
</div>


      <h2 className="mb-4 d-flex justify-content-between align-items-center">
        Posts List
        <div>
          <Button variant="success" className="me-2" onClick={() => setShowAddForm(true)}>
            + Add Post
          </Button>
          <Button variant="dark" onClick={() => setShowCart(!showCart)}>
            🛒 View Cart ({cartItems.length})
          </Button>
        </div>
      </h2>

      <Row>
        {posts.map((post) => (
          <Col md={4} key={post.id} className="mb-4">
            <Card>
              <Card.Body>
                {/* <Card.Title>{post.id}</Card.Title> */}
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.body.slice(0, 100)}...</Card.Text>
                <Card.Subtitle className="mb-2 text-muted">Views: {post.views}</Card.Subtitle>
                <Button variant="primary" onClick={() => handleAddToCart(post)}>
                  Add to Cart
                </Button>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Tags: {post.tags.join(", ")}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

     

    </Container>
  );
};

export default Posts;
