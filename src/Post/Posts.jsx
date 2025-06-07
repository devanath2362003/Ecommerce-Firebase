import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "./Fireconfig";
import { ref, push, onValue, remove, update } from "firebase/database";
import './Post.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "", tags: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editKey, setEditKey] = useState(null);

  // Load posts from Firebase
  useEffect(() => {
    const postsRef = ref(db, "posts");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedPosts = Object.entries(data).map(([key, post]) => ({
          firebaseKey: key,
          ...post,
        }));
        setPosts(loadedPosts);
      } else {
        setPosts([]);
      }
    });
  }, []);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const postToSave = {
      ...newPost,
      tags: newPost.tags.split(",").map((tag) => tag.trim()),
      views: newPost.views || 0,
      userId: newPost.userId || 999,
    };

    if (isEditing && editKey) {
      // UPDATE post
      const postRef = ref(db, `posts/${editKey}`);
      update(postRef, postToSave).then(() => {
        resetForm();
      });
    } else {
      // ADD new post
      const postWithId = {
        ...postToSave,
        id: posts.length + 1,
      };
      push(ref(db, "posts"), postWithId).then(() => {
        resetForm();
      });
    }
  };

  const resetForm = () => {
    setNewPost({ title: "", body: "", tags: "" });
    setShowAddForm(false);
    setIsEditing(false);
    setEditKey(null);
  };

  const handleEdit = (post) => {
    setNewPost({
      title: post.title,
      body: post.body,
      tags: post.tags.join(", "),
      views: post.views,
      userId: post.userId,
    });
    setIsEditing(true);
    setEditKey(post.firebaseKey);
    setShowAddForm(true);
  };

  const handleDelete = (key) => {
    const postRef = ref(db, `posts/${key}`);
    remove(postRef);
  };

  const handleAddToCart = (post) => {
    setCartItems((prev) => [...prev, post]);
    setShowCart(true);
  };

  return (
    <Container className="mt-4 position-relative">
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
          <Col md={4} key={post.firebaseKey} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.body.slice(0, 100)}...</Card.Text>
                <Card.Subtitle className="mb-2 text-muted">Views: {post.views}</Card.Subtitle>
                <div className="d-flex justify-content-between mt-3">
                  <Button variant="primary" size="sm" onClick={() => handleAddToCart(post)}>
                    Add to Cart
                  </Button>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(post)}>
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(post.firebaseKey)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Tags: {post.tags.join(", ")}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add/Edit Post Sidebar */}
      <div className={`sidebar-form ${showAddForm ? "show" : ""}`}>
        <h4>{isEditing ? "Edit Post" : "Add New Post"}</h4>
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
            {isEditing ? "Update Post" : "Submit Post"}
          </Button>
          <Button variant="secondary" className="mt-3 ms-2" onClick={resetForm}>
            Cancel
          </Button>
        </Form>
      </div>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${showCart ? "show" : ""}`}>
        <button className="close-icon" onClick={() => setShowCart(false)}>❌</button>
        <h4>Cart Items</h4>
        {cartItems.length === 0 ? (
          <p>No posts in cart.</p>
        ) : (
          cartItems.map((item, index) => (
            <Card key={index} className="mb-3">
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.body.slice(0, 60)}...</Card.Text>
              </Card.Body>
            </Card>
          ))
        )}
        <Button variant="danger" className="mt-2" onClick={() => setCartItems([])}>
          Clear Cart
        </Button>
      </div>
    </Container>
  );
};

export default Posts;
